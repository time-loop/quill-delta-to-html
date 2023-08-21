import { DeltaInsertOp } from './../DeltaInsertOp';
import { IOpAttributes } from './../OpAttributeSanitizer';
import cloneDeep from 'lodash/cloneDeep';

class InlineGroup {
  readonly ops: DeltaInsertOp[];
  constructor(ops: DeltaInsertOp[]) {
    this.ops = ops;
  }
}

class SingleItem {
  readonly op: DeltaInsertOp;
  constructor(op: DeltaInsertOp) {
    this.op = op;
  }
}
class VideoItem extends SingleItem {}
class BlotBlock extends SingleItem {}

class EmptyBlock extends SingleItem {
  constructor(attrs?: IOpAttributes) {
    super(new DeltaInsertOp('', attrs));
  }
}

class BlockGroup {
  readonly op: DeltaInsertOp;
  ops: DeltaInsertOp[];
  constructor(op: DeltaInsertOp, ops: DeltaInsertOp[]) {
    this.op = op;
    this.ops = ops;
  }
}

class ListGroup {
  items: ListItem[];
  headListItem: ListItem;
  headOp: DeltaInsertOp | undefined;
  layout: string;
  layoutWidth: string;
  layoutAlign: string;
  bannerId: string;
  bannerColor: string;
  bannerIcon: string;
  bannerInList: string;
  bannerListIndent: string;
  counters: string;
  readonly isEmptyNest: boolean | undefined;
  constructor(items: ListItem[], isEmptyNest?: boolean) {
    this.items = items;
    this.isEmptyNest = isEmptyNest;
    this.headListItem = items[0];

    const availableHeadItem = this.getAvailableHeadItem();
    this.setHeadOpIfThisListIsNestedWithTable(availableHeadItem);
    this.setAttributesForColumnLayout(availableHeadItem);
    this.setAttributesForNestedBanner(availableHeadItem);
    this.setCountersForContinuousList(availableHeadItem);
  }

  private getAvailableHeadItem(): ListItem {
    let curItem = this.headListItem;
    while (curItem.item instanceof EmptyBlock && curItem.innerList) {
      curItem = curItem.innerList.items[0];
    }
    return curItem;
  }

  private setHeadOpIfThisListIsNestedWithTable(item: ListItem) {
    if (item && item.item.op.attributes && item.item.op.attributes.list?.cell) {
      this.headOp = item.item.op;
    }
  }

  private setAttributesForColumnLayout(item: ListItem) {
    if (item && item.item.op.attributes && item.item.op.attributes.layout) {
      this.layout = item.item.op.attributes.layout;
    }

    if (
      item &&
      item.item.op.attributes &&
      item.item.op.attributes.layoutWidth
    ) {
      this.layoutWidth = item.item.op.attributes.layoutWidth;
    }

    if (
      item &&
      item.item.op.attributes &&
      item.item.op.attributes.layoutAlign
    ) {
      this.layoutAlign = item.item.op.attributes.layoutAlign;
    }
  }

  private setAttributesForNestedBanner(item: ListItem) {
    if (
      item &&
      item.item.op.attributes &&
      item.item.op.attributes['advanced-banner']
    ) {
      this.bannerId = item.item.op.attributes['advanced-banner'] || '';
    }

    if (
      item &&
      item.item.op.attributes &&
      item.item.op.attributes['advanced-banner-color']
    ) {
      this.bannerColor = item.item.op.attributes['advanced-banner-color'];
    }

    if (
      item &&
      item.item.op.attributes &&
      item.item.op.attributes['advanced-banner-icon']
    ) {
      this.bannerIcon = item.item.op.attributes['advanced-banner-icon'];
    }

    if (
      item &&
      item.item.op.attributes &&
      item.item.op.attributes['advanced-banner-in-list']
    ) {
      this.bannerInList = item.item.op.attributes['advanced-banner-in-list'];
    }

    if (
      item &&
      item.item.op.attributes &&
      item.item.op.attributes['advanced-banner-list-indent']
    ) {
      this.bannerListIndent =
        item.item.op.attributes['advanced-banner-list-indent'];
    }
  }

  private setCountersForContinuousList(item: ListItem) {
    if (item && item.item.op) {
      this.counters = item.item.op.getListAttributes([
        'blockquote',
        'code-block',
        'banner',
        'bookmark',
      ]).counters;
    }
  }
}

class ListItem {
  readonly item: BlockGroup | BlotBlock | EmptyBlock | AdvancedBanner;
  innerList: ListGroup | null;
  readonly layout: string;
  readonly bannerId: string;
  constructor(
    item: BlockGroup | BlotBlock | EmptyBlock | AdvancedBanner,
    innerList: ListGroup | null = null
  ) {
    this.item = item;
    this.innerList = innerList;

    if (item instanceof AdvancedBanner) {
      this.layout = item.layout;
      this.bannerId = item.banner;
    } else {
      this.layout = item.op.attributes.layout || '';
      this.bannerId = item.op.attributes['advanced-banner'] || '';
    }
  }
}

class TableGroup {
  rows: TableRow[];
  colGroup: TableColGroup;
  constructor(rows: TableRow[], colGroup: TableColGroup) {
    this.rows = rows;
    this.colGroup = colGroup;
  }
}

class TableColGroup {
  cols: TableCol[];
  constructor(cols: TableCol[]) {
    this.cols = cols;
  }
}

class TableCol {
  item: BlockGroup;
  constructor(item: BlockGroup) {
    this.item = item;
  }
}

class TableRow {
  cells: TableCell[];
  readonly row: string | undefined;
  constructor(cells: TableCell[], row: string | undefined) {
    this.cells = cells;
    this.row = row;
  }
}

class TableCell {
  lines: (TableCellLine | ListGroup)[];
  readonly attrs: IOpAttributes | undefined;
  constructor(lines: (TableCellLine | ListGroup)[], attributes: IOpAttributes) {
    this.lines = lines;
    this.attrs = attributes;
  }
}

class TableCellLine {
  readonly item: BlockGroup;
  readonly attrs: IOpAttributes | undefined;
  constructor(item: BlockGroup) {
    this.item = item;
    this.attrs = item.op.attributes['table-cell-line'];
  }
}

class LayoutColumn {
  items: any[];
  readonly layout: string;
  readonly width: string;
  readonly align: string;
  constructor(
    items: any[],
    layout: string,
    width: string,
    align: string = 'top'
  ) {
    this.items = items;
    this.layout = layout;
    this.width = width;
    this.align = align;
  }
}

class LayoutRow {
  columns: LayoutColumn[];
  constructor(columns: any[]) {
    this.columns = columns;
  }
}

class AdvancedBanner {
  items: any[];
  readonly banner: string;
  readonly color: string;
  readonly icon: string;
  readonly inList: string;
  readonly listIndent: string;
  readonly layout: string;
  readonly op: DeltaInsertOp;

  constructor(
    items: any[],
    banner: string,
    color: string,
    icon: string = 'top',
    inList: string,
    listIndent: string,
    layout: string
  ) {
    this.items = items;
    this.banner = banner;
    this.color = color;
    this.icon = icon;
    this.inList = inList;
    this.listIndent = listIndent;
    this.layout = layout;
    /**
     * Set op attribute for AdvancedBanner
     * When the first child of AdvancedBanner is ListGroup, it needs to be set to the op of the first listItem of the ListGroup.
     */
    if (items[0] instanceof ListGroup) {
      this.op = cloneDeep(items[0].headListItem.item.op);
      this.op.attributes.list = undefined;
    } else {
      this.op = items[0].op;
    }
  }
}

type TDataGroup =
  | VideoItem
  | InlineGroup
  | BlockGroup
  | ListItem
  | ListGroup
  | TableGroup
  | TableColGroup
  | TableCol
  | TableRow
  | TableCell
  | TableCellLine
  | LayoutColumn
  | LayoutRow
  | AdvancedBanner;

export {
  VideoItem,
  BlotBlock,
  EmptyBlock,
  InlineGroup,
  BlockGroup,
  ListGroup,
  ListItem,
  TableGroup,
  TableColGroup,
  TableCol,
  TableRow,
  TableCell,
  TableCellLine,
  LayoutColumn,
  LayoutRow,
  TDataGroup,
  AdvancedBanner,
};

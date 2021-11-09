import { DeltaInsertOp } from './../DeltaInsertOp';
import { IOpAttributes } from './../OpAttributeSanitizer';

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
  readonly headOp: DeltaInsertOp | undefined;
  readonly layout: string;
  readonly layoutWidth: string;
  readonly layoutAlign: string;
  constructor(items: ListItem[]) {
    this.items = items;

    const headListItem = items[0];
    if (
      headListItem &&
      headListItem.item.op.attributes &&
      headListItem.item.op.attributes.cell
    ) {
      this.headOp = headListItem.item.op;
    }

    if (
      headListItem &&
      headListItem.item.op.attributes &&
      headListItem.item.op.attributes.layout
    ) {
      this.layout = headListItem.item.op.attributes.layout;
    }

    if (
      headListItem &&
      headListItem.item.op.attributes &&
      headListItem.item.op.attributes.layoutWidth
    ) {
      this.layoutWidth = headListItem.item.op.attributes.layoutWidth;
    }

    if (
      headListItem &&
      headListItem.item.op.attributes &&
      headListItem.item.op.attributes.layoutAlign
    ) {
      this.layoutAlign = headListItem.item.op.attributes.layoutAlign;
    }
  }
}

class ListItem {
  readonly item: BlockGroup | BlotBlock;
  innerList: ListGroup | null;
  readonly layout: string;
  constructor(
    item: BlockGroup | BlotBlock,
    innerList: ListGroup | null = null
  ) {
    this.item = item;
    this.innerList = innerList;
    this.layout = item.op.attributes.layout || '';
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
  | LayoutRow;

export {
  VideoItem,
  BlotBlock,
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
};

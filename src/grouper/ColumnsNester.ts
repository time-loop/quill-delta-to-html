import {
  TDataGroup,
  LayoutColumn,
  LayoutRow,
  BlockGroup,
  ListGroup,
  BlotBlock,
  AdvancedBanner,
} from './group-types';
import { groupConsecutiveElementsWhile } from '../helpers/array';

const SPLIT_SYMBOL = '_';

export class ColumnsNester {
  nest(groups: TDataGroup[]): TDataGroup[] {
    var layoutColumnBlocked = this.convertBlocksToLayoutColumns(groups);
    var layoutRowNested = this.convertLayoutColumnsToLayoutRow(
      layoutColumnBlocked
    );

    return layoutRowNested;
  }

  private convertBlocksToLayoutColumns(items: TDataGroup[]): Array<TDataGroup> {
    var grouped = groupConsecutiveElementsWhile(
      items,
      (g: TDataGroup, gPrev: TDataGroup) => {
        const gLayout = getLayoutId(g);
        const gPrevLayout = getLayoutId(gPrev);
        return !!gLayout && !!gPrevLayout && gLayout === gPrevLayout;
      }
    );

    return grouped.map((item: TDataGroup | TDataGroup[]) => {
      if (!Array.isArray(item)) {
        if (getLayoutId(item)) {
          return new LayoutColumn(
            [item],
            getLayoutId(item),
            getLayoutWidth(item),
            getLayoutAlign(item),
            getLayoutRowWidth(item)
          );
        }
        return item;
      }

      return new LayoutColumn(
        item,
        getLayoutId(item[0]),
        getLayoutWidth(item[0]),
        getLayoutAlign(item[0]),
        getLayoutRowWidth(item[0])
      );
    });
  }

  private convertLayoutColumnsToLayoutRow(
    items: TDataGroup[]
  ): Array<TDataGroup> {
    var grouped = groupConsecutiveElementsWhile(
      items,
      (g: TDataGroup, gPrev: TDataGroup) => {
        return (
          g instanceof LayoutColumn &&
          gPrev instanceof LayoutColumn &&
          getLayoutRowIdFromLayoutColumn(g) ===
            getLayoutRowIdFromLayoutColumn(gPrev)
        );
      }
    );

    return grouped.map((item: TDataGroup | TDataGroup[]) => {
      if (!Array.isArray(item)) {
        if (item instanceof LayoutColumn) {
          return new LayoutRow([item]);
        }
        return item;
      }

      return new LayoutRow(item);
    });
  }
}

function getLayoutId(g: TDataGroup) {
  if (g instanceof BlockGroup) {
    return g.op.attributes.layout || '';
  } else if (g instanceof ListGroup || g instanceof AdvancedBanner) {
    return g.layout || '';
  } else if (g instanceof BlotBlock) {
    return g.op.attributes.layout || '';
  }
  return '';
}

function getLayoutWidth(g: TDataGroup) {
  if (g instanceof BlockGroup) {
    return g.op.attributes['layout-width'] || '';
  } else if (g instanceof ListGroup) {
    return g.layoutWidth || '';
  } else if (g instanceof BlotBlock || g instanceof AdvancedBanner) {
    return g.op.attributes['layout-width'] || '';
  }
  return '';
}

function getLayoutAlign(g: TDataGroup) {
  if (g instanceof BlockGroup) {
    return g.op.attributes['layout-align'] || 'top';
  } else if (g instanceof ListGroup) {
    return g.layoutAlign || 'top';
  } else if (g instanceof BlotBlock || g instanceof AdvancedBanner) {
    return g.op.attributes['layout-align'] || 'top';
  }
  return '';
}

function getLayoutRowWidth(g: TDataGroup) {
  if (g instanceof BlockGroup) {
    return g.op.attributes['layout-row-width'] || '';
  } else if (g instanceof ListGroup) {
    return g.layoutRowWidth || '';
  } else if (g instanceof BlotBlock || g instanceof AdvancedBanner) {
    return g.op.attributes['layout-row-width'] || '';
  }
  return '';
}

function getLayoutRowIdFromLayoutColumn(g: LayoutColumn) {
  return g.layout.split(SPLIT_SYMBOL)[0];
}

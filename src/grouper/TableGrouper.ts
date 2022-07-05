import {
  TDataGroup,
  TableGroup,
  TableColGroup,
  TableCol,
  BlockGroup,
  TableRow,
  TableCell,
  TableCellLine,
  ListGroup,
  BlotBlock,
} from './group-types';
import { groupConsecutiveElementsWhile } from '../helpers/array';
import { IOpAttributes } from '../OpAttributeSanitizer';
import { DeltaInsertOp } from '../DeltaInsertOp';

export class TableGrouper {
  blocksCanBeWrappedWithList: string[];

  constructor(blocksCanBeWrappedWithList: string[] = []) {
    this.blocksCanBeWrappedWithList = blocksCanBeWrappedWithList;
  }

  group(groups: TDataGroup[]): TDataGroup[] {
    var tableColBlocked = this.convertTableColBlocksToTableColGroup(groups);
    var tableBlocked = this.convertTableBlocksToTableGroups(tableColBlocked);
    return tableBlocked;
  }

  private convertTableBlocksToTableGroups(
    items: TDataGroup[]
  ): Array<TDataGroup> {
    var grouped = groupConsecutiveElementsWhile(
      items,
      (g: TDataGroup, gPrev: TDataGroup) => {
        return (
          (g instanceof BlockGroup &&
            gPrev instanceof BlockGroup &&
            g.op.isTableCellLine() &&
            gPrev.op.isTableCellLine()) ||
          (g instanceof ListGroup &&
            gPrev instanceof BlockGroup &&
            g.headOp &&
            g.headOp!.attributes &&
            g.headOp!.attributes!.cell &&
            gPrev.op.isTableCellLine()) ||
          (g instanceof BlockGroup &&
            gPrev instanceof ListGroup &&
            g.op.isTableCellLine() &&
            gPrev.headOp &&
            gPrev.headOp!.attributes &&
            gPrev.headOp!.attributes!.cell) ||
          (g instanceof ListGroup &&
            gPrev instanceof ListGroup &&
            !!g.headOp &&
            g.headOp!.attributes &&
            !!gPrev.headOp &&
            gPrev.headOp!.attributes &&
            g.headOp!.attributes!.cell &&
            gPrev.headOp!.attributes!.cell) ||
          (g instanceof BlotBlock &&
            gPrev instanceof BlockGroup &&
            g.op.isEmptyTableCell() &&
            gPrev.op.isTableCellLine()) ||
          (g instanceof BlockGroup &&
            gPrev instanceof BlotBlock &&
            g.op.isTableCellLine() &&
            gPrev.op.isEmptyTableCell()) ||
          (g instanceof BlotBlock &&
            gPrev instanceof BlotBlock &&
            g.op.isEmptyTableCell() &&
            gPrev.op.isEmptyTableCell()) ||
          (g instanceof BlotBlock &&
            gPrev instanceof ListGroup &&
            g.op.isEmptyTableCell() &&
            gPrev.headOp &&
            gPrev.headOp!.attributes &&
            gPrev.headOp!.attributes!.cell) ||
          (g instanceof ListGroup &&
            gPrev instanceof BlotBlock &&
            g.headOp &&
            g.headOp!.attributes &&
            g.headOp!.attributes!.cell &&
            gPrev.op.isEmptyTableCell())
        );
      }
    );

    let tableColGroup: TableColGroup;
    return grouped.reduce(
      (result: TDataGroup[], item: TDataGroup | BlockGroup[]) => {
        if (!Array.isArray(item)) {
          if (item instanceof BlockGroup && item.op.isTableCellLine()) {
            result.push(
              new TableGroup(
                [
                  new TableRow(
                    [
                      new TableCell(
                        [new TableCellLine(item)],
                        item.op.attributes
                      ),
                    ],
                    item.op.attributes.row
                  ),
                ],
                tableColGroup ||
                  new TableColGroup([
                    new TableCol(
                      new BlockGroup(
                        new DeltaInsertOp('\n', {
                          'table-col': { width: '150' },
                        }),
                        []
                      )
                    ),
                  ])
              )
            );
          } else if (item instanceof ListGroup && !!item.headOp) {
            result.push(
              new TableGroup(
                [
                  new TableRow(
                    [new TableCell([item], item.headOp.attributes)],
                    item.headOp.attributes.row
                  ),
                ],
                tableColGroup ||
                  new TableColGroup([
                    new TableCol(
                      new BlockGroup(
                        new DeltaInsertOp('\n', {
                          'table-col': { width: '150' },
                        }),
                        []
                      )
                    ),
                  ])
              )
            );
          } else if (item instanceof TableColGroup) {
            tableColGroup = item;
          } else {
            result.push(item);
          }

          return result;
        }

        result.push(
          new TableGroup(
            this.convertTableBlocksToTableRows(
              this.convertTableBlocksToTableCells(item)
            ),
            tableColGroup
          )
        );
        return result;
      },
      []
    );
  }

  private convertTableBlocksToTableRows(items: TDataGroup[]): TableRow[] {
    var grouped = groupConsecutiveElementsWhile(
      items,
      (g: TDataGroup, gPrev: TDataGroup) => {
        return (
          g instanceof TableCell &&
          gPrev instanceof TableCell &&
          (g.attrs ? g.attrs.row : undefined) ===
            (gPrev.attrs ? gPrev.attrs.row : undefined)
        );
      }
    );

    return grouped.map((item: TableCell | TableCell[]) => {
      let row;
      if (Array.isArray(item)) {
        const firstCell = item[0];
        if (firstCell) {
          row = firstCell.attrs ? firstCell.attrs.row : undefined;
        }
      } else {
        if (item.attrs) {
          row = item.attrs.row;
        } else {
          row = undefined;
        }
      }

      return new TableRow(
        Array.isArray(item) ? item.map((it) => it) : [item],
        row
      );
    });
  }

  private convertTableBlocksToTableCells(items: TDataGroup[]): TableCell[] {
    var grouped = groupConsecutiveElementsWhile(
      items,
      (g: TDataGroup, gPrev: TDataGroup) => {
        return (
          (g instanceof BlockGroup &&
            gPrev instanceof BlockGroup &&
            g.op.isTableCellLine() &&
            gPrev.op.isTableCellLine() &&
            g.op.isSameTableCellAs(
              gPrev.op,
              this.blocksCanBeWrappedWithList
            )) ||
          (g instanceof BlockGroup &&
            gPrev instanceof ListGroup &&
            g.op.isTableCellLine() &&
            !!gPrev.headOp &&
            g.op.isSameTableCellAs(
              gPrev.headOp,
              this.blocksCanBeWrappedWithList
            )) ||
          (g instanceof ListGroup &&
            gPrev instanceof BlockGroup &&
            gPrev.op.isTableCellLine() &&
            !!g.headOp &&
            g.headOp.isSameTableCellAs(
              gPrev.op,
              this.blocksCanBeWrappedWithList
            )) ||
          (g instanceof ListGroup &&
            gPrev instanceof ListGroup &&
            !!g.headOp &&
            !!gPrev.headOp &&
            g.headOp.isSameTableCellAs(
              gPrev.headOp,
              this.blocksCanBeWrappedWithList
            ))
        );
      }
    );

    return grouped.map(
      (
        item: (BlockGroup | ListGroup | BlotBlock) | (BlockGroup | ListGroup)[]
      ) => {
        if (item instanceof BlotBlock) {
          return new TableCell([], { row: item.op.insert.value });
        }

        const head = Array.isArray(item) ? item[0] : item;
        let attrs: IOpAttributes;
        if (head instanceof BlockGroup) {
          attrs = head.op.attributes;
        } else {
          attrs = head.headOp!.attributes;
        }

        let children: (TableCellLine | ListGroup)[];
        if (Array.isArray(item)) {
          children = item.map((it) => {
            return it instanceof BlockGroup ? new TableCellLine(it) : it;
          });
        } else {
          if (item instanceof BlockGroup) {
            children = [new TableCellLine(item)];
          } else {
            children = [item];
          }
        }

        return new TableCell(children, attrs);
      }
    );
  }

  private convertTableColBlocksToTableColGroup(
    items: TDataGroup[]
  ): TDataGroup[] {
    var grouped = groupConsecutiveElementsWhile(
      items,
      (g: TDataGroup, gPrev: TDataGroup) => {
        return (
          g instanceof BlockGroup &&
          gPrev instanceof BlockGroup &&
          g.op.isTableCol() &&
          gPrev.op.isTableCol()
        );
      }
    );

    return grouped.map((item: BlockGroup | BlockGroup[]) => {
      if (!Array.isArray(item)) {
        if (item instanceof BlockGroup && item.op.isTableCol()) {
          return new TableColGroup([new TableCol(item)]);
        }
        return item;
      }

      return new TableColGroup(
        Array.isArray(item)
          ? item.map((it) => new TableCol(it))
          : [new TableCol(item)]
      );
    });
  }
}

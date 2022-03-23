import {
  ListGroup,
  ListItem,
  BlockGroup,
  TDataGroup,
  BlotBlock,
  EmptyBlock,
} from './group-types';
import { flatten, groupConsecutiveElementsWhile } from './../helpers/array';
import find from 'lodash-es/find';

class ListNester {
  blocksCanBeWrappedWithList: string[];

  constructor(blocksCanBeWrappedWithList: string[] = []) {
    this.blocksCanBeWrappedWithList = blocksCanBeWrappedWithList;
  }

  nest(groups: TDataGroup[]): TDataGroup[] {
    var listBlocked = this.convertListBlocksToListGroups(groups);
    var groupedByListGroups = this.groupConsecutiveListGroups(listBlocked);
    // convert grouped ones into listgroup
    var nested = flatten(
      groupedByListGroups.map((group: TDataGroup) => {
        if (!Array.isArray(group)) {
          return group;
        }
        return this.nestListSection(group);
      })
    );

    var groupRootLists = groupConsecutiveElementsWhile(
      nested,
      (curr: TDataGroup, prev: TDataGroup) => {
        if (!(curr instanceof ListGroup && prev instanceof ListGroup)) {
          return false;
        }

        return (
          curr.layout === prev.layout &&
          (curr.items[0].item.op.isList() ||
            prev.items[0].item.op.isList() ||
            curr.items[0].item.op.isListBlockWrapper(
              this.blocksCanBeWrappedWithList
            ) ||
            prev.items[0].item.op.isListBlockWrapper(
              this.blocksCanBeWrappedWithList
            ))
        );
      }
    );

    return groupRootLists.map((v: TDataGroup | ListGroup[]) => {
      if (!Array.isArray(v)) {
        return v;
      }
      var litems = v.map((g: ListGroup): ListItem[] => g.items);
      return new ListGroup(flatten(litems));
    });
  }

  private convertListBlocksToListGroups(
    items: TDataGroup[]
  ): Array<TDataGroup> {
    const hasSameIndentation = (
      g: BlockGroup | BlotBlock,
      gPrev: BlockGroup | BlotBlock
    ): boolean => {
      const gAttrKey = find(
        this.blocksCanBeWrappedWithList,
        (key) => !!g.op.attributes[key]
      );
      const gIndent =
        gAttrKey && g.op.isListBlockWrapper(this.blocksCanBeWrappedWithList)
          ? parseInt(g.op.attributes[gAttrKey]['wrapper-indent'], 10) || 0
          : g.op.attributes.indent || 0;
      const gPrevAttrKey = find(
        this.blocksCanBeWrappedWithList,
        (key) => !!gPrev.op.attributes[key]
      );
      const gPrevIndent =
        gPrevAttrKey &&
        gPrev.op.isListBlockWrapper(this.blocksCanBeWrappedWithList)
          ? parseInt(gPrev.op.attributes[gPrevAttrKey]['wrapper-indent'], 10) ||
            0
          : gPrev.op.attributes.indent || 0;
      return gIndent === gPrevIndent;
    };

    const listInSameTableCell = (
      g: BlockGroup | BlotBlock,
      gPrev: BlockGroup | BlotBlock
    ): boolean => {
      const gAttrKey = find(
        this.blocksCanBeWrappedWithList,
        (key) => !!g.op.attributes[key]
      );
      const gCellId =
        gAttrKey && g.op.isListBlockWrapper(this.blocksCanBeWrappedWithList)
          ? g.op.attributes[gAttrKey]['cell']
          : g.op.isList()
          ? g.op.attributes.list!.cell
          : '';
      const gPrevAttrKey = find(
        this.blocksCanBeWrappedWithList,
        (key) => !!gPrev.op.attributes[key]
      );
      const gPrevCellId =
        gPrevAttrKey &&
        gPrev.op.isListBlockWrapper(this.blocksCanBeWrappedWithList)
          ? gPrev.op.attributes[gPrevAttrKey]['cell']
          : gPrev.op.isList()
          ? gPrev.op.attributes.list!.cell
          : '';
      return gCellId === gPrevCellId;
    };

    var grouped = groupConsecutiveElementsWhile(
      items,
      (g: TDataGroup, gPrev: TDataGroup) => {
        return (
          (g instanceof BlockGroup &&
            gPrev instanceof BlockGroup &&
            g.op.isList() &&
            gPrev.op.isList() &&
            g.op.hasSameIndentationAs(
              gPrev.op,
              this.blocksCanBeWrappedWithList
            ) &&
            ((!g.op.isLayoutColumnBlock() && !gPrev.op.isLayoutColumnBlock()) ||
              g.op.isSameColumnAs(gPrev.op)) &&
            g.op.attributes.list!.cell === gPrev.op.attributes.list!.cell) ||
          ((g instanceof BlockGroup || g instanceof BlotBlock) &&
            (gPrev instanceof BlockGroup || gPrev instanceof BlotBlock) &&
            ((g.op.isListBlockWrapper(this.blocksCanBeWrappedWithList) &&
              gPrev.op.isList()) ||
              (g.op.isList() &&
                gPrev.op.isListBlockWrapper(this.blocksCanBeWrappedWithList)) ||
              (g.op.isListBlockWrapper(this.blocksCanBeWrappedWithList) &&
                gPrev.op.isListBlockWrapper(
                  this.blocksCanBeWrappedWithList
                ))) &&
            hasSameIndentation(g, gPrev) &&
            listInSameTableCell(g, gPrev) &&
            g.op.isSameColumnAs(gPrev.op))
        );
      }
    );

    return grouped.map((item: TDataGroup | (BlockGroup | BlotBlock)[]) => {
      if (!Array.isArray(item)) {
        if (
          (item instanceof BlockGroup || item instanceof BlotBlock) &&
          (item.op.isList() ||
            item.op.isListBlockWrapper(this.blocksCanBeWrappedWithList))
        ) {
          return new ListGroup([new ListItem(item)]);
        }
        return item;
      }
      return new ListGroup(item.map((g) => new ListItem(g)));
    });
  }

  private groupConsecutiveListGroups(
    items: TDataGroup[]
  ): Array<TDataGroup | ListGroup[]> {
    return groupConsecutiveElementsWhile(
      items,
      (curr: TDataGroup, prev: TDataGroup) => {
        return (
          curr instanceof ListGroup &&
          prev instanceof ListGroup &&
          curr.layout === prev.layout
        );
      }
    );
  }

  private nestListSection(sectionItems: ListGroup[]): ListGroup[] {
    var indentGroups = this.groupByIndent(sectionItems);

    Object.keys(indentGroups)
      .map(Number)
      .sort()
      .reverse()
      .forEach((indent) => {
        indentGroups[indent].forEach((lg: ListGroup) => {
          var idx = sectionItems.indexOf(lg);
          if (this.placeUnderParent(lg, sectionItems.slice(0, idx))) {
            sectionItems.splice(idx, 1);
          }
        });
      });

    /**
     * Wrap listGroup according to indentation.
     * Supports render: where the indent of the first item of the list is not 0.
     */
    const wrappedSectionItems = sectionItems.map((item) => {
      let wrappedListGroup = item;
      const indent =
        item.items[0].item.op.getIndent(this.blocksCanBeWrappedWithList) || 0;
      for (let i = indent; i > 0; i--) {
        wrappedListGroup = new ListGroup([
          new ListItem(
            new EmptyBlock({
              list: item.items[0].item.op.attributes.list,
            }),
            wrappedListGroup
          ),
        ]);
      }
      return wrappedListGroup;
    });

    return wrappedSectionItems;
  }

  private groupByIndent(items: ListGroup[]): { [index: number]: ListGroup[] } {
    return items.reduce(
      (pv: { [index: number]: ListGroup[] }, cv: ListGroup) => {
        let indent;
        if (
          cv.items[0].item.op.isListBlockWrapper(
            this.blocksCanBeWrappedWithList
          )
        ) {
          const attrKey: string =
            find(
              this.blocksCanBeWrappedWithList,
              (key) => !!cv.items[0].item.op.attributes[key]
            ) || '';
          indent = parseInt(
            cv.items[0].item.op.attributes[attrKey]['wrapper-indent'],
            10
          );
        } else {
          indent = cv.items[0].item.op.attributes.indent;
        }

        if (indent) {
          pv[indent] = pv[indent] || [];
          pv[indent].push(cv);
        }
        return pv;
      },
      {}
    );
  }

  private placeUnderParent(target: ListGroup, items: ListGroup[]) {
    for (let i = items.length - 1; i >= 0; i--) {
      var elm = items[i];
      if (
        target.items[0].item.op.hasHigherIndentThan(
          elm.items[0].item.op,
          this.blocksCanBeWrappedWithList
        )
      ) {
        const childIndent =
          target.items[0].item.op.getIndent(this.blocksCanBeWrappedWithList) ||
          0;
        const parentIndent =
          elm.items[0].item.op.getIndent(this.blocksCanBeWrappedWithList) || 0;
        let parentRef = elm.items[elm.items.length - 1];
        for (let i = childIndent - parentIndent; i > 0; i--) {
          if (i === 1) {
            if (parentRef.innerList) {
              parentRef.innerList.items = parentRef.innerList.items.concat(
                target.items
              );
            } else {
              parentRef.innerList = target;
            }
          } else {
            if (!parentRef.innerList) {
              parentRef.innerList = new ListGroup([
                new ListItem(
                  new EmptyBlock({
                    list: target.items[0].item.op.attributes.list,
                  }),
                  null
                ),
              ]);
            }
            parentRef =
              parentRef.innerList.items[parentRef.innerList.items.length - 1];
          }
        }
        return true;
      }
    }
    return false;
  }
}

export { ListNester };

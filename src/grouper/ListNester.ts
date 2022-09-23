import {
  ListGroup,
  ListItem,
  BlockGroup,
  TDataGroup,
  BlotBlock,
  EmptyBlock,
  AdvancedBanner,
} from './group-types';
import { flatten, groupConsecutiveElementsWhile } from './../helpers/array';
import find from 'lodash-es/find';
import { BannerNester } from './BannerNester';

class ListNester {
  blocksCanBeWrappedWithList: string[];

  constructor(blocksCanBeWrappedWithList: string[] = []) {
    this.blocksCanBeWrappedWithList = blocksCanBeWrappedWithList;
  }

  nest(groups: TDataGroup[], ignoreBanner: boolean): TDataGroup[] {
    const grouped = ignoreBanner
      ? groups
      : this.nestAdvancedBannerInList(groups);
    const listBlocked = this.convertListBlocksToListGroups(grouped);
    const groupedByListGroups = this.groupConsecutiveListGroups(listBlocked);
    // convert grouped ones into listgroup
    const nested = flatten(
      groupedByListGroups.map((group: TDataGroup) => {
        if (!Array.isArray(group)) {
          return group;
        }
        return this.nestListSection(group);
      })
    );

    const wrappedNested = nested.map((g: TDataGroup) => {
      if (g instanceof ListGroup) {
        return this.makeUpForListIndentationForListGroup(g);
      }
      return g;
    });

    var groupRootLists = groupConsecutiveElementsWhile(
      wrappedNested,
      (curr: TDataGroup, prev: TDataGroup) => {
        if (!(curr instanceof ListGroup && prev instanceof ListGroup)) {
          return false;
        }

        return (
          curr.layout === prev.layout &&
          (curr.bannerId === prev.bannerId ||
            !!curr.bannerInList ||
            !!prev.bannerInList) &&
          ((!curr.headOp && !prev.headOp) ||
            (!!curr.headOp &&
              !!prev.headOp &&
              curr.headOp.isSameTableCellAs(
                prev.headOp,
                this.blocksCanBeWrappedWithList
              )))
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
        const isTheListItemInTheSameListAsAnotherListItem =
          g instanceof BlockGroup &&
          gPrev instanceof BlockGroup &&
          g.op.isList() &&
          gPrev.op.isList() &&
          g.op.hasSameIndentationAs(
            gPrev.op,
            this.blocksCanBeWrappedWithList
          ) &&
          ((!g.op.isLayoutColumnBlock() && !gPrev.op.isLayoutColumnBlock()) ||
            g.op.isSameColumnAs(gPrev.op)) &&
          ((!g.op.isAdvancedBannerBlock() &&
            !gPrev.op.isAdvancedBannerBlock()) ||
            g.op.isSameBannerAs(gPrev.op)) &&
          g.op.attributes.list!.cell === gPrev.op.attributes.list!.cell;

        const isTheListItemOrListBlockWrapperInTheSameListAsAnotherListItemOrListBlockWrapper =
          (g instanceof BlockGroup || g instanceof BlotBlock) &&
          (gPrev instanceof BlockGroup || gPrev instanceof BlotBlock) &&
          ((g.op.isListBlockWrapper(this.blocksCanBeWrappedWithList) &&
            gPrev.op.isList()) ||
            (g.op.isList() &&
              gPrev.op.isListBlockWrapper(this.blocksCanBeWrappedWithList)) ||
            (g.op.isListBlockWrapper(this.blocksCanBeWrappedWithList) &&
              gPrev.op.isListBlockWrapper(this.blocksCanBeWrappedWithList))) &&
          hasSameIndentation(g, gPrev) &&
          listInSameTableCell(g, gPrev) &&
          g.op.isSameColumnAs(gPrev.op) &&
          g.op.isSameBannerAs(gPrev.op);

        const isTheAdvancedBannerInTheSameListAsAnotherListItemOrListBlockWrapper =
          g instanceof AdvancedBanner &&
          (gPrev instanceof BlockGroup || gPrev instanceof BlotBlock) &&
          ((g.listIndent && parseInt(g.listIndent, 10)) || 0) ===
            (gPrev.op.getIndent(this.blocksCanBeWrappedWithList) || 0);

        const isTheListItemOrListBlockWrapperInTheSameListAsTheAdvancedBanner =
          gPrev instanceof AdvancedBanner &&
          (g instanceof BlockGroup || g instanceof BlotBlock) &&
          ((gPrev.listIndent && parseInt(gPrev.listIndent, 10)) || 0) ===
            (g.op.getIndent(this.blocksCanBeWrappedWithList) || 0);

        const isTheAdvancedBannerInTheSameListAsAnotherAdvancedBanner =
          g instanceof AdvancedBanner &&
          gPrev instanceof AdvancedBanner &&
          ((g.listIndent && parseInt(g.listIndent, 10)) || 0) ===
            ((gPrev.listIndent && parseInt(gPrev.listIndent, 10)) || 0);

        return (
          isTheListItemInTheSameListAsAnotherListItem ||
          isTheListItemOrListBlockWrapperInTheSameListAsAnotherListItemOrListBlockWrapper ||
          isTheAdvancedBannerInTheSameListAsAnotherListItemOrListBlockWrapper ||
          isTheListItemOrListBlockWrapperInTheSameListAsTheAdvancedBanner ||
          isTheAdvancedBannerInTheSameListAsAnotherAdvancedBanner
        );
      }
    );

    return grouped.map((item: TDataGroup | (BlockGroup | BlotBlock)[]) => {
      if (!Array.isArray(item)) {
        if (
          (item instanceof BlockGroup &&
            (item.op.isList() ||
              item.op.isListBlockWrapper(this.blocksCanBeWrappedWithList))) ||
          (item instanceof BlotBlock &&
            item.op.isListBlockWrapper(this.blocksCanBeWrappedWithList)) ||
          (item instanceof AdvancedBanner &&
            item.op.isAdvancedBannerBlockInList())
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
          curr.layout === prev.layout &&
          (curr.bannerId === prev.bannerId ||
            !!curr.bannerInList ||
            !!prev.bannerInList) &&
          ((!curr.headOp && !prev.headOp) ||
            (!!curr.headOp &&
              !!prev.headOp &&
              curr.headOp.isSameTableCellAs(
                prev.headOp,
                this.blocksCanBeWrappedWithList
              )))
        );
      }
    );
  }

  private nestAdvancedBannerInList(items: TDataGroup[]): Array<TDataGroup> {
    const grouped = groupConsecutiveElementsWhile(
      items,
      (g: TDataGroup, gPrev: TDataGroup) => {
        return (
          (g instanceof BlockGroup || g instanceof BlotBlock) &&
          (gPrev instanceof BlockGroup || gPrev instanceof BlotBlock) &&
          g.op.isAdvancedBannerBlockInList() &&
          gPrev.op.isAdvancedBannerBlockInList() &&
          g.op.isSameBannerAs(gPrev.op)
        );
      }
    );

    const listNester = new ListNester(this.blocksCanBeWrappedWithList);
    const bannerNester = new BannerNester();
    return grouped.map((item: TDataGroup | (BlockGroup | BlotBlock)[]) => {
      if (!Array.isArray(item)) {
        return item;
      }
      return bannerNester.nest(listNester.nest(item, true))[0];
    });
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

    return sectionItems;
  }

  private groupByIndent(items: ListGroup[]): { [index: number]: ListGroup[] } {
    return items.reduce(
      (pv: { [index: number]: ListGroup[] }, cv: ListGroup) => {
        const indent = cv.items[0].item.op.getIndent(
          this.blocksCanBeWrappedWithList
        );

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
        const childListType = target.items[0].item.op.getListType(
          this.blocksCanBeWrappedWithList
        );
        const childListAttrs = target.items[0].item.op.getListAttributes(
          this.blocksCanBeWrappedWithList
        );
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
              parentRef.innerList = new ListGroup(
                [
                  new ListItem(
                    new EmptyBlock({
                      list: Object.assign({}, childListAttrs, {
                        list: childListType,
                      }),
                    }),
                    null
                  ),
                ],
                true
              );
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

  /**
   * Wrap listGroup according to indentation.
   * Supports rendering: where the indent of the first item of the list is not 0.
   */
  private makeUpForListIndentationForListGroup(group: ListGroup) {
    let wrappedListGroup: ListGroup = group;
    const indent =
      group.items[0].item.op.getIndent(this.blocksCanBeWrappedWithList) || 0;
    const listType =
      group.items[0].item.op.getListType(this.blocksCanBeWrappedWithList) || '';
    const listAttrs =
      group.items[0].item.op.getListAttributes(
        this.blocksCanBeWrappedWithList
      ) || '';
    for (let i = indent; i > 0; i--) {
      wrappedListGroup = new ListGroup(
        [
          new ListItem(
            new EmptyBlock({
              list: Object.assign({}, listAttrs, {
                list: listType,
              }),
            }),
            wrappedListGroup
          ),
        ],
        true
      );
    }
    return wrappedListGroup;
  }
}

export { ListNester };

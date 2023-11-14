import { InsertOpsConverter } from './InsertOpsConverter';
import {
  OpToHtmlConverter,
  IOpToHtmlConverterOptions,
  IInlineStyles,
} from './OpToHtmlConverter';
import { DeltaInsertOp } from './DeltaInsertOp';
import { Grouper } from './grouper/Grouper';
import {
  VideoItem,
  InlineGroup,
  BlockGroup,
  ListGroup,
  ListItem,
  TDataGroup,
  BlotBlock,
  TableGroup,
  TableRow,
  TableCell,
  TableCol,
  TableColGroup,
  TableCellLine,
  LayoutRow,
  LayoutColumn,
  EmptyBlock,
  AdvancedBanner,
} from './grouper/group-types';
import { ListNester } from './grouper/ListNester';
import {
  makeStartTag,
  makeEndTag,
  encodeHtml,
  ITagKeyValue,
} from './funcs-html';
import * as obj from './helpers/object';
import { GroupType, ListType } from './value-types';
import { IOpAttributeSanitizerOptions } from './OpAttributeSanitizer';
import { TableGrouper } from './grouper/TableGrouper';
import { ColumnsNester } from './grouper/ColumnsNester';
import { BannerNester } from './grouper/BannerNester';

interface IQuillDeltaToHtmlConverterOptions
  extends IOpAttributeSanitizerOptions,
    IOpToHtmlConverterOptions {
  orderedListTag?: string;
  bulletListTag?: string;
  multiLineBlockquote?: boolean;
  multiLineHeader?: boolean;
  multiLineCodeblock?: boolean;
  multiLineParagraph?: boolean;
  multiLineCustomBlock?: boolean;
  blocksCanBeWrappedWithList?: string[] | undefined;
  customBlockIsEqual?: (g: BlockGroup, gOther: BlockGroup) => boolean;
  customListGroupAttrs?: (g: ListGroup, isRoot: boolean) => ITagKeyValue[];
  customTableCellAttrs?: (g: TableCell) => ITagKeyValue[];
}

const BrTag = '<br/>';

class QuillDeltaToHtmlConverter {
  private options: IQuillDeltaToHtmlConverterOptions;
  private rawDeltaOps: any[] = [];
  private converterOptions: IOpToHtmlConverterOptions;

  // render callbacks
  private callbacks: any = {};

  constructor(deltaOps: any[], options?: IQuillDeltaToHtmlConverterOptions) {
    this.options = obj.assign(
      {
        paragraphTag: 'p',
        encodeHtml: true,
        classPrefix: 'ql',
        inlineStyles: false,
        multiLineBlockquote: true,
        multiLineHeader: true,
        multiLineCodeblock: true,
        multiLineParagraph: true,
        multiLineCustomBlock: true,
        allowBackgroundClasses: false,
        linkTarget: '_blank',
      },
      options,
      {
        orderedListTag: 'ol',
        bulletListTag: 'ul',
        listItemTag: 'li',
      }
    );

    var inlineStyles: IInlineStyles | undefined;
    if (!this.options.inlineStyles) {
      inlineStyles = undefined;
    } else if (typeof this.options.inlineStyles === 'object') {
      inlineStyles = this.options.inlineStyles;
    } else {
      inlineStyles = {};
    }

    this.converterOptions = {
      encodeHtml: this.options.encodeHtml,
      classPrefix: this.options.classPrefix,
      inlineStyles: inlineStyles,
      listItemTag: this.options.listItemTag,
      paragraphTag: this.options.paragraphTag,
      linkRel: this.options.linkRel,
      linkTarget: this.options.linkTarget,
      allowBackgroundClasses: this.options.allowBackgroundClasses,
      blocksCanBeWrappedWithList: this.options.blocksCanBeWrappedWithList || [],
      customTag: this.options.customTag,
      customTagAttributes: this.options.customTagAttributes,
      customCssClasses: this.options.customCssClasses,
      customCssStyles: this.options.customCssStyles,
    };
    this.rawDeltaOps = deltaOps;
  }

  _getListTag(op: DeltaInsertOp): string {
    return op.isOrderedList()
      ? this.options.orderedListTag + ''
      : op.isBulletList()
      ? this.options.bulletListTag + ''
      : op.isToggledList()
      ? this.options.bulletListTag + ''
      : op.isNoneTypeList()
      ? this.options.bulletListTag + ''
      : op.isCheckedList()
      ? this.options.bulletListTag + ''
      : op.isUncheckedList()
      ? this.options.bulletListTag + ''
      : op.isListBlockWrapper(this.options.blocksCanBeWrappedWithList)
      ? this.options.bulletListTag + ''
      : '';
  }

  getGroupedOps(): TDataGroup[] {
    var deltaOps = InsertOpsConverter.convert(this.rawDeltaOps, this.options);
    var pairedOps = Grouper.pairOpsWithTheirBlock(deltaOps);

    var groupedSameStyleBlocks = Grouper.groupConsecutiveSameStyleBlocks(
      pairedOps,
      {
        blockquotes: !!this.options.multiLineBlockquote,
        header: !!this.options.multiLineHeader,
        codeBlocks: !!this.options.multiLineCodeblock,
        customBlocks: !!this.options.multiLineCustomBlock,
      },
      this.options.customBlockIsEqual
    );

    var groupedOps = Grouper.reduceConsecutiveSameStyleBlocksToOne(
      groupedSameStyleBlocks
    );

    var listNester = new ListNester(this.options.blocksCanBeWrappedWithList);
    groupedOps = listNester.nest(groupedOps);

    var tableGrouper = new TableGrouper(
      this.options.blocksCanBeWrappedWithList
    );
    groupedOps = tableGrouper.group(groupedOps);

    var bannerNester = new BannerNester();
    groupedOps = bannerNester.nest(groupedOps);

    var columnsNester = new ColumnsNester();
    groupedOps = columnsNester.nest(groupedOps);

    return groupedOps;
  }

  convert() {
    let groups = this.getGroupedOps();
    return groups
      .map((group) => {
        if (group instanceof ListGroup) {
          return this._renderWithCallbacks(GroupType.List, group, () =>
            this._renderList(<ListGroup>group, true)
          );
        } else if (group instanceof TableGroup) {
          return this._renderWithCallbacks(GroupType.TableCellLine, group, () =>
            this._renderTable(<TableGroup>group)
          );
        } else if (group instanceof BlockGroup) {
          var g = <BlockGroup>group;

          return this._renderWithCallbacks(GroupType.Block, group, () =>
            this._renderBlock(g.op, g.ops)
          );
        } else if (group instanceof BlotBlock) {
          return this._renderCustom(group.op, null);
        } else if (group instanceof VideoItem) {
          return this._renderWithCallbacks(GroupType.Video, group, () => {
            var g = <VideoItem>group;
            var converter = new OpToHtmlConverter(g.op, this.converterOptions);
            return converter.getHtml();
          });
        } else if (group instanceof LayoutRow) {
          return this._renderWithCallbacks(GroupType.LayoutRow, group, () =>
            this._renderLayoutRow(<LayoutRow>group)
          );
        } else if (group instanceof AdvancedBanner) {
          return this._renderWithCallbacks(
            GroupType.AdvancedBanner,
            group,
            () => this._renderAdvancedBanner(<AdvancedBanner>group)
          );
        } else {
          // InlineGroup
          return this._renderWithCallbacks(GroupType.InlineGroup, group, () => {
            return this._renderInlines((<InlineGroup>group).ops, true);
          });
        }
      })
      .join('');
  }

  _renderWithCallbacks(
    groupType: GroupType,
    group: TDataGroup,
    myRenderFn: () => string
  ) {
    var html = '';
    var beforeCb = this.callbacks['beforeRender_cb'];
    html =
      typeof beforeCb === 'function'
        ? beforeCb.apply(null, [groupType, group, myRenderFn])
        : '';

    if (!html) {
      html = myRenderFn();
    }

    var afterCb = this.callbacks['afterRender_cb'];
    html =
      typeof afterCb === 'function'
        ? afterCb.apply(null, [groupType, group, html])
        : html;

    return html;
  }

  _renderList(list: ListGroup, isRoot = false): string {
    var firstItem = list.items[0];
    let attrsOfList: ITagKeyValue[] = !!list.headOp
      ? [
          { key: 'data-row', value: list.headOp.attributes.list?.row },
          { key: 'data-cell', value: list.headOp.attributes.list?.cell },
          { key: 'data-rowspan', value: list.headOp.attributes.list?.rowspan },
          { key: 'data-colspan', value: list.headOp.attributes.list?.colspan },
        ]
      : [];

    if (this.options.customListGroupAttrs) {
      const userAttrs = this.options.customListGroupAttrs(list, isRoot);
      attrsOfList = [...userAttrs, ...attrsOfList];
    }

    return (
      makeStartTag(this._getListTag(firstItem.item.op), attrsOfList) +
      list.items.map((li: ListItem) => this._renderListItem(li)).join('') +
      makeEndTag(this._getListTag(firstItem.item.op))
    );
  }

  _renderListItem(li: ListItem): string {
    //if (!isOuterMost) {
    li.item.op.attributes.indent = 0;
    //}
    var converter = new OpToHtmlConverter(li.item.op, this.converterOptions);
    var parts =
      li.item instanceof EmptyBlock
        ? converter.getHtmlPartsForEmptyBlock()
        : converter.getHtmlParts();
    var liElementsHtml;
    if (li.item instanceof BlockGroup) {
      if (li.item.op.isCodeBlock()) {
        liElementsHtml = encodeHtml(
          li.item.ops.map((iop) => iop.insert.value).join('')
        );
      } else {
        liElementsHtml = this._renderInlines(li.item.ops, true);
      }
    } else if (li.item instanceof BlotBlock) {
      liElementsHtml = this._renderCustom(li.item.op, null);
    } else if (li.item instanceof EmptyBlock) {
      liElementsHtml = '';
    } else if (li.item instanceof AdvancedBanner) {
      liElementsHtml = this._renderAdvancedBanner(li.item);
      parts.openingTag = '';
      parts.closingTag = '';
    }

    return (
      parts.openingTag +
      liElementsHtml +
      (li.innerList ? this._renderList(li.innerList) : '') +
      parts.closingTag
    );
  }

  _renderTable(table: TableGroup): string {
    const tableColGroup: TableColGroup = table.colGroup;
    let tableWidth: number = 0;
    if (tableColGroup && tableColGroup.cols) {
      tableWidth = tableColGroup.cols.reduce(
        (result: number, col: TableCol) => {
          if (col.item.op.attributes['table-col']) {
            result += parseInt(
              col.item.op.attributes['table-col']!.width || '0',
              10
            );
          }
          return result;
        },
        0
      );
    }

    return (
      makeStartTag('div', [{ key: 'class', value: 'clickup-table-view' }]) +
      makeStartTag('table', [
        { key: 'class', value: 'clickup-table' },
        { key: 'style', value: !!tableWidth ? `width: ${tableWidth}px` : '' },
      ]) +
      makeStartTag('colgroup') +
      tableColGroup.cols
        .map((col: TableCol) => this._renderTableCol(col))
        .join('') +
      makeEndTag('colgroup') +
      makeStartTag('tbody') +
      table.rows.map((row: TableRow) => this._renderTableRow(row)).join('') +
      makeEndTag('tbody') +
      makeEndTag('table') +
      makeEndTag('div')
    );
  }

  _renderTableCol(col: TableCol): string {
    let colWidth: any;
    if (col.item.op.attributes['table-col']) {
      colWidth = col.item.op.attributes['table-col']!.width || '0';
    }

    return makeStartTag('col', [{ key: 'width', value: colWidth }]);
  }

  _renderTableRow(row: TableRow): string {
    return (
      makeStartTag('tr', [{ key: 'data-row', value: row.row }]) +
      row.cells.map((cell: TableCell) => this._renderTableCell(cell)).join('') +
      makeEndTag('tr')
    );
  }

  _renderTableCell(cell: TableCell): string {
    const customAttributes = this.options.customTableCellAttrs
      ? this.options.customTableCellAttrs(cell)
      : [];

    const cellAttributes =
      cell.attrs?.['table-cell-line'] || cell.attrs?.list || cell.attrs;
    const attributes: ITagKeyValue[] = [
      { key: 'data-row', value: cellAttributes?.row },
      { key: 'rowspan', value: cellAttributes?.rowspan },
      { key: 'colspan', value: cellAttributes?.colspan },
    ];

    customAttributes.forEach((item) => {
      const isExisted = attributes.some((attr) => attr.key === item.key);
      if (!isExisted) {
        attributes.push(item);
      }
    });

    return (
      makeStartTag('td', attributes) +
      cell.lines
        .map((item: TableCellLine | ListGroup) => {
          return item instanceof TableCellLine
            ? this._renderTableCellLine(item)
            : this._renderList(item, true);
        })
        .join('') +
      makeEndTag('td')
    );
  }

  _renderTableCellLine(line: TableCellLine): string {
    var converter = new OpToHtmlConverter(line.item.op, this.converterOptions);
    var parts = converter.getHtmlParts();
    var cellElementsHtml = this._renderInlines(line.item.ops, false);
    return parts.openingTag + cellElementsHtml + parts.closingTag;
  }

  _renderLayoutRow(row: LayoutRow): string {
    const firstColumn = row.columns[0];
    const rowAttrs = [{ key: 'class', value: 'ql-layout-row-container' }];
    if (firstColumn && firstColumn.rowWidth) {
      rowAttrs.push({
        key: 'style',
        value: `width: ${
          parseFloat(firstColumn.rowWidth) * 100
        }%; max-width: 100%;`,
      });
    }

    return (
      makeStartTag('div', rowAttrs) +
      row.columns
        .map((col: LayoutColumn) => this._renderLayoutColumn(col))
        .join('') +
      makeEndTag('div')
    );
  }

  _renderLayoutColumn(column: LayoutColumn): string {
    const columnAttrs = [{ key: 'class', value: 'ql-layout-col-container' }];

    if (!!column.width) {
      columnAttrs.push({
        key: 'style',
        value: `flex: initial; width: calc(100% * ${column.width})`,
      });
    }

    if (!!column.align) {
      columnAttrs.push({
        key: 'data-layout-align',
        value: column.align,
      });
    }

    return (
      makeStartTag('div', columnAttrs) +
      column.items
        .map((group) => {
          if (group instanceof ListGroup) {
            return this._renderWithCallbacks(GroupType.List, group, () =>
              this._renderList(<ListGroup>group)
            );
          } else if (group instanceof TableGroup) {
            return this._renderWithCallbacks(
              GroupType.TableCellLine,
              group,
              () => this._renderTable(<TableGroup>group)
            );
          } else if (group instanceof BlockGroup) {
            var g = <BlockGroup>group;

            return this._renderWithCallbacks(GroupType.Block, group, () =>
              this._renderBlock(g.op, g.ops)
            );
          } else if (group instanceof BlotBlock) {
            return this._renderCustom(group.op, null);
          } else if (group instanceof VideoItem) {
            return this._renderWithCallbacks(GroupType.Video, group, () => {
              var g = <VideoItem>group;
              var converter = new OpToHtmlConverter(
                g.op,
                this.converterOptions
              );
              return converter.getHtml();
            });
          } else if (group instanceof AdvancedBanner) {
            return this._renderWithCallbacks(
              GroupType.AdvancedBanner,
              group,
              () => this._renderAdvancedBanner(<AdvancedBanner>group)
            );
          } else {
            // InlineGroup
            return this._renderWithCallbacks(
              GroupType.InlineGroup,
              group,
              () => {
                return this._renderInlines((<InlineGroup>group).ops, true);
              }
            );
          }
        })
        .join('') +
      makeEndTag('div')
    );
  }

  _renderAdvancedBanner(banner: AdvancedBanner): string {
    const bannerAttrs = [{ key: 'class', value: 'ql-advanced-banner' }];

    if (!!banner.color) {
      bannerAttrs.push({
        key: 'data-advanced-banner-color',
        value: banner.color,
      });
    }

    if (!!banner.icon) {
      bannerAttrs.push({
        key: 'data-advanced-banner-icon',
        value: banner.icon,
      });
    }

    const openingTags = [makeStartTag('div', bannerAttrs)];
    const endTags = [makeEndTag('div')];
    if (banner.inList) {
      const listAttrs =
        banner.inList === ListType.Ordered
          ? [
              { key: 'data-none-type', value: 'true' },
              { key: 'class', value: 'ql-rendered-ordered-list' },
            ]
          : [{ key: 'data-none-type', value: 'true' }];

      openingTags.unshift(makeStartTag('li', listAttrs));
      endTags.push(makeEndTag('li'));
    }

    return (
      openingTags.join('') +
      banner.items
        .map((group) => {
          if (group instanceof ListGroup) {
            return this._renderWithCallbacks(GroupType.List, group, () =>
              this._renderList(<ListGroup>group)
            );
          } else if (group instanceof TableGroup) {
            return this._renderWithCallbacks(
              GroupType.TableCellLine,
              group,
              () => this._renderTable(<TableGroup>group)
            );
          } else if (group instanceof BlockGroup) {
            var g = <BlockGroup>group;

            return this._renderWithCallbacks(GroupType.Block, group, () =>
              this._renderBlock(g.op, g.ops)
            );
          } else if (group instanceof BlotBlock) {
            return this._renderCustom(group.op, null);
          } else if (group instanceof VideoItem) {
            return this._renderWithCallbacks(GroupType.Video, group, () => {
              var g = <VideoItem>group;
              var converter = new OpToHtmlConverter(
                g.op,
                this.converterOptions
              );
              return converter.getHtml();
            });
          } else {
            // InlineGroup
            return this._renderWithCallbacks(
              GroupType.InlineGroup,
              group,
              () => {
                return this._renderInlines((<InlineGroup>group).ops, true);
              }
            );
          }
        })
        .join('') +
      endTags.join('')
    );
  }

  _renderBlock(bop: DeltaInsertOp, ops: DeltaInsertOp[]) {
    var converter = new OpToHtmlConverter(bop, this.converterOptions);
    var htmlParts = converter.getHtmlParts();

    if (bop.isCodeBlock()) {
      return (
        htmlParts.openingTag +
        encodeHtml(
          ops
            .map((iop) =>
              iop.isCustomEmbed()
                ? this._renderCustom(iop, bop)
                : iop.insert.value
            )
            .join('')
        ) +
        htmlParts.closingTag
      );
    }

    var inlines = ops.map((op) => this._renderInline(op, bop)).join('');
    return htmlParts.openingTag + (inlines || BrTag) + htmlParts.closingTag;
  }

  _renderInlines(ops: DeltaInsertOp[], isInlineGroup = true) {
    var opsLen = ops.length - 1;
    var html = ops
      .map((op: DeltaInsertOp, i: number) => {
        if (i > 0 && i === opsLen && op.isJustNewline()) {
          return '';
        }
        return this._renderInline(op, null);
      })
      .join('');
    if (!isInlineGroup) {
      return html;
    }

    let startParaTag = makeStartTag(this.options.paragraphTag);
    let endParaTag = makeEndTag(this.options.paragraphTag);
    if (html === BrTag || this.options.multiLineParagraph) {
      return startParaTag + html + endParaTag;
    }
    return (
      startParaTag +
      html
        .split(BrTag)
        .map((v) => {
          return v === '' ? BrTag : v;
        })
        .join(endParaTag + startParaTag) +
      endParaTag
    );
  }

  _renderInline(op: DeltaInsertOp, contextOp: DeltaInsertOp | null) {
    if (op.isCustomEmbed()) {
      return this._renderCustom(op, contextOp);
    }
    var converter = new OpToHtmlConverter(op, this.converterOptions);
    return converter.getHtml().replace(/\n/g, BrTag);
  }

  _renderCustom(op: DeltaInsertOp, contextOp: DeltaInsertOp | null) {
    var renderCb = this.callbacks['renderCustomOp_cb'];
    if (typeof renderCb === 'function') {
      return renderCb.apply(null, [op, contextOp]);
    }
    return '';
  }

  beforeRender(
    cb: (group: GroupType, data: TDataGroup, renderFn: () => string) => string
  ) {
    if (typeof cb === 'function') {
      this.callbacks['beforeRender_cb'] = cb;
    }
  }

  afterRender(
    cb: (group: GroupType, data: TDataGroup, html: string) => string
  ) {
    if (typeof cb === 'function') {
      this.callbacks['afterRender_cb'] = cb;
    }
  }

  renderCustomWith(
    cb: (op: DeltaInsertOp, contextOp: DeltaInsertOp) => string
  ) {
    this.callbacks['renderCustomOp_cb'] = cb;
  }
}

export { QuillDeltaToHtmlConverter };

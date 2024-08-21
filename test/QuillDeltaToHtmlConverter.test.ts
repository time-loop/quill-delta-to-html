import * as assert from 'assert';
import isEqual from 'lodash/isEqual';
import { BlockGroup, InlineGroup } from '../src/grouper/group-types';
import { DeltaInsertOp } from './../src/DeltaInsertOp';
import { encodeHtml } from './../src/funcs-html';
import { QuillDeltaToHtmlConverter } from './../src/QuillDeltaToHtmlConverter';
import { GroupType, ListType } from './../src/value-types';
import { delta1 } from './data/delta1';
import { callWhenXEqualY } from './_helper';

describe('QuillDeltaToHtmlConverter', function () {
  describe('constructor()', function () {
    var hugeOps = [
      { insert: 'huge', attributes: { size: 'huge', attr1: 'red' } },
      { insert: '\n' },
    ];

    it('should instantiate return proper html', function () {
      var qdc = new QuillDeltaToHtmlConverter(delta1.ops, {
        classPrefix: 'noz',
      });
      var html = qdc.convert();
      assert.equal(html, delta1.html);
    });

    it('should set default inline styles for `inlineStyles: true`', function () {
      var qdc = new QuillDeltaToHtmlConverter(hugeOps, {
        inlineStyles: true,
        customCssStyles: (op) => {
          if (op.attributes['attr1'] === 'red') {
            return ['color:red'];
          }
        },
      });
      var html = qdc.convert();
      assert.equal(
        html.includes('<span style="color:red;font-size: 2.5em">huge</span>'),
        true,
        html
      );
    });

    it('should set default inline styles when `inlineStyles` is a truthy non-object', function () {
      var qdc = new QuillDeltaToHtmlConverter(hugeOps, {
        inlineStyles: 1,
      } as any);
      var html = qdc.convert();
      assert.equal(
        html.includes('<span style="font-size: 2.5em">huge</span>'),
        true,
        html
      );
    });

    it('should allow setting inline styles', function () {
      var qdc = new QuillDeltaToHtmlConverter(hugeOps, {
        inlineStyles: {
          size: {
            huge: 'font-size: 6em',
          },
        },
      });
      var html = qdc.convert();
      assert.equal(
        html.includes('<span style="font-size: 6em">huge</span>'),
        true,
        html
      );
    });
  });

  describe('convert()', function () {
    var ops2 = [
      { insert: 'this is text' },
      { insert: '\n' },
      { insert: 'this is code' },
      { insert: '\n', attributes: { 'code-block': true } },
      { insert: 'this is code TOO!' },
      { insert: '\n', attributes: { 'code-block': true } },
    ];

    it('should render html', function () {
      var qdc = new QuillDeltaToHtmlConverter(ops2);

      var html = qdc.convert();
      assert.equal(html.indexOf('<pre>this is code') > -1, true, html);
    });

    it('should render mention', function () {
      let ops = [
        {
          insert: 'mention',
          attributes: {
            mentions: true,
            mention: {
              'end-point': 'http://abc.com',
              slug: 'a',
              class: 'abc',
              target: '_blank',
            },
          },
        },
      ];
      var qdc = new QuillDeltaToHtmlConverter(ops);
      var html = qdc.convert();
      assert.equal(
        html,
        [
          '<p><a class="abc"',
          ' href="http://abc.com/a" target="_blank"',
          '>mention</a></p>',
        ].join('')
      );

      var qdc = new QuillDeltaToHtmlConverter([
        {
          insert: 'mention',
          attributes: {
            mentions: true,
            mention: { slug: 'aa' },
          },
        },
      ]);
      var html = qdc.convert();
      assert.equal(
        html,
        ['<p><a', ' href="about:blank">mention</a></p>'].join('')
      );
    });
    it('should render links with rels', function () {
      var ops = [
        {
          attributes: {
            link: '#',
            rel: 'nofollow noopener',
          },
          insert: 'external link',
        },
        {
          attributes: {
            link: '#',
          },
          insert: 'internal link',
        },
      ];
      var qdc = new QuillDeltaToHtmlConverter(ops, {
        linkRel: 'license',
      });
      var html = qdc.convert();
      assert.equal(
        html,
        '<p><a href="#" target="_blank" rel="nofollow noopener">external link</a><a href="#" target="_blank" rel="license">internal link</a></p>'
      );

      qdc = new QuillDeltaToHtmlConverter(ops);
      html = qdc.convert();
      assert.equal(
        html,
        '<p><a href="#" target="_blank" rel="nofollow noopener">external link</a><a href="#" target="_blank">internal link</a></p>'
      );
    });
    it('should render image and image links', function () {
      let ops = [
        { insert: { image: 'http://yahoo.com/abc.jpg' } },
        {
          insert: { image: 'http://yahoo.com/def.jpg' },
          attributes: { link: 'http://aha' },
        },
      ];
      let qdc = new QuillDeltaToHtmlConverter(ops);
      let html = qdc.convert();
      assert.equal(
        html,
        [
          '<p>',
          '<img class="ql-image" src="http://yahoo.com/abc.jpg"/>',
          '<a href="http://aha" target="_blank">',
          '<img class="ql-image" src="http://yahoo.com/def.jpg"/>',
          '</a>',
          '</p>',
        ].join('')
      );
    });

    it('should open and close list tags', function () {
      var ops4 = [
        { insert: 'mr\n' },
        { insert: 'hello' },
        { insert: '\n', attributes: { list: { list: 'ordered' } } },
        { insert: 'there' },
        { insert: '\n', attributes: { list: { list: 'bullet' } } },
        { insert: '\n', attributes: { list: { list: 'ordered' } } },
      ];
      var qdc = new QuillDeltaToHtmlConverter(ops4);
      var html = qdc.convert();

      assert.equal(html.indexOf('<p>mr') > -1, true);
      assert.equal(html.indexOf('</li></ol>') > -1, true);
    });

    it('should render as separate paragraphs', function () {
      var ops4 = [{ insert: 'hello\nhow areyou?\n\nbye' }];
      var qdc = new QuillDeltaToHtmlConverter(ops4, {
        multiLineParagraph: false,
      });
      var html = qdc.convert();

      assert.equal(
        html,
        '<p>hello</p><p>how areyou?</p><p><br/></p><p>bye</p>'
      );
    });

    it('should create checked/unchecked lists', function () {
      debugger;
      var ops4 = [
        { insert: 'hello' },
        { insert: '\n', attributes: { list: { list: 'checked' } } },
        { insert: 'there' },
        { insert: '\n', attributes: { list: { list: 'unchecked' } } },
        { insert: 'man' },
        { insert: '\n', attributes: { list: { list: 'checked' } } },
        { insert: 'not done' },
        {
          insert: '\n',
          attributes: { indent: 1, list: { list: 'unchecked' } },
        },
      ];
      var qdc = new QuillDeltaToHtmlConverter(ops4);
      var html = qdc.convert();
      assert.equal(
        html,
        [
          '<ul>',
          '<li data-checked="true"><p>hello</p></li>',
          '<li data-checked="false"><p>there</p></li>',
          '<li data-checked="true"><p>man</p>',
          '<ul><li data-checked="false"><p>not done</p></li></ul>',
          '</li>',
          '</ul>',
        ].join('')
      );
    });

    it('should wrap positional styles in right tag', function () {
      var ops4 = [
        { insert: 'mr' },
        { insert: '\n', attributes: { align: 'center' } },
        { insert: '\n', attributes: { direction: 'rtl' } },
        { insert: '\n', attributes: { indent: 2 } },
      ];
      var qdc = new QuillDeltaToHtmlConverter(ops4, { paragraphTag: 'div' });
      var html = qdc.convert();
      assert.equal(html.indexOf('<div class="ql-align') > -1, true);
      assert.equal(html.indexOf('<div class="ql-direction') > -1, true);
      assert.equal(html.indexOf('<div class="ql-indent') > -1, true);

      var qdc = new QuillDeltaToHtmlConverter(ops4);
      var html = qdc.convert();
      assert.equal(html.indexOf('<p class="ql-align') > -1, true);
      assert.equal(html.indexOf('<p class="ql-direction') > -1, true);
      assert.equal(html.indexOf('<p class="ql-indent') > -1, true);
    });
    it('should render target attr correctly', () => {
      let ops = [
        { attributes: { target: '_self', link: 'http://#' }, insert: 'A' },
        { attributes: { target: '_blank', link: 'http://#' }, insert: 'B' },
        { attributes: { link: 'http://#' }, insert: 'C' },
        { insert: '\n' },
      ];
      let qdc = new QuillDeltaToHtmlConverter(ops, { linkTarget: '' });
      let html = qdc.convert();
      assert.equal(
        html,
        [
          `<p><a href="http://#" target="_self">A</a>`,
          `<a href="http://#" target="_blank">B</a>`,
          `<a href="http://#">C</a></p>`,
        ].join('')
      );

      qdc = new QuillDeltaToHtmlConverter(ops);
      html = qdc.convert();
      assert.equal(
        html,
        [
          `<p><a href="http://#" target="_self">A</a>`,
          `<a href="http://#" target="_blank">B</a>`,
          `<a href="http://#" target="_blank">C</a></p>`,
        ].join('')
      );

      qdc = new QuillDeltaToHtmlConverter(ops, { linkTarget: '_top' });
      html = qdc.convert();
      assert.equal(
        html,
        [
          `<p><a href="http://#" target="_self">A</a>`,
          `<a href="http://#" target="_blank">B</a>`,
          `<a href="http://#" target="_top">C</a></p>`,
        ].join('')
      );
    });

    it('should convert using custom url sanitizer', () => {
      let ops = [
        { attributes: { link: 'http://yahoo<%=abc%>/ed' }, insert: 'test' },
        { attributes: { link: 'http://abc<' }, insert: 'hi' },
      ];

      let qdc = new QuillDeltaToHtmlConverter(ops, {
        urlSanitizer: (link: string) => {
          if (link.indexOf('<%') > -1) {
            return link;
          }
          return undefined;
        },
      });
      assert.equal(
        qdc.convert(),
        [
          `<p><a href="http://yahoo<%=abc%>/ed" target="_blank">test</a>`,
          `<a href="http://abc&lt;" target="_blank">hi</a></p>`,
        ].join('')
      );
    });

    // test case for cu-table
    it('should render empty cu-table', () => {
      let ops = [
        {
          attributes: {
            'table-col': { width: '150' },
          },
          insert: '\n\n\n',
        },
        {
          attributes: {
            'table-cell-line': {
              rowspan: '1',
              colspan: '1',
              row: 'row-dvagmt',
              cell: 'cell-383p7o',
            },
            row: 'row-dvagmt',
            rowspan: '1',
            colspan: '1',
          },
          insert: '\n',
        },
        {
          attributes: {
            'table-cell-line': {
              rowspan: '1',
              colspan: '1',
              row: 'row-dvagmt',
              cell: 'cell-kdrmch',
            },
            row: 'row-dvagmt',
            rowspan: '1',
            colspan: '1',
          },
          insert: '\n',
        },
        {
          attributes: {
            'table-cell-line': {
              rowspan: '1',
              colspan: '1',
              row: 'row-dvagmt',
              cell: 'cell-ljjq9j',
            },
            row: 'row-dvagmt',
            rowspan: '1',
            colspan: '1',
          },
          insert: '\n',
        },
        {
          attributes: {
            'table-cell-line': {
              rowspan: '1',
              colspan: '1',
              row: 'row-929dk8',
              cell: 'cell-lj7h6y',
            },
            row: 'row-929dk8',
            rowspan: '1',
            colspan: '1',
          },
          insert: '\n',
        },
        {
          attributes: {
            'table-cell-line': {
              rowspan: '1',
              colspan: '1',
              row: 'row-929dk8',
              cell: 'cell-l0enbj',
            },
            row: 'row-929dk8',
            rowspan: '1',
            colspan: '1',
          },
          insert: '\n',
        },
        {
          attributes: {
            'table-cell-line': {
              rowspan: '1',
              colspan: '1',
              row: 'row-929dk8',
              cell: 'cell-xa4lb9',
            },
            row: 'row-929dk8',
            rowspan: '1',
            colspan: '1',
          },
          insert: '\n',
        },
        {
          attributes: {
            'table-cell-line': {
              rowspan: '1',
              colspan: '1',
              row: 'row-j95olh',
              cell: 'cell-2w5wjp',
            },
            row: 'row-j95olh',
            rowspan: '1',
            colspan: '1',
          },
          insert: '\n',
        },
        {
          attributes: {
            'table-cell-line': {
              rowspan: '1',
              colspan: '1',
              row: 'row-j95olh',
              cell: 'cell-o7q92h',
            },
            row: 'row-j95olh',
            rowspan: '1',
            colspan: '1',
          },
          insert: '\n',
        },
        {
          attributes: {
            'table-cell-line': {
              rowspan: '1',
              colspan: '1',
              row: 'row-j95olh',
              cell: 'cell-4nujo2',
            },
            row: 'row-j95olh',
            rowspan: '1',
            colspan: '1',
          },
          insert: '\n',
        },
      ];

      let qdc = new QuillDeltaToHtmlConverter(ops);
      assert.equal(
        qdc.convert(),
        [
          `<div class="clickup-table-view">`,
          `<table class="clickup-table" style="width: 450px">`,
          `<colgroup>`,
          `<col width="150"><col width="150"><col width="150">`,
          `</colgroup>`,
          `<tbody>`,
          `<tr data-row="row-dvagmt">`,
          `<td data-row="row-dvagmt" rowspan="1" colspan="1"><p class="qlbt-cell-line" data-row="row-dvagmt" data-cell="cell-383p7o" data-rowspan="1" data-colspan="1"><br/></p></td>`,
          `<td data-row="row-dvagmt" rowspan="1" colspan="1"><p class="qlbt-cell-line" data-row="row-dvagmt" data-cell="cell-kdrmch" data-rowspan="1" data-colspan="1"><br/></p></td>`,
          `<td data-row="row-dvagmt" rowspan="1" colspan="1"><p class="qlbt-cell-line" data-row="row-dvagmt" data-cell="cell-ljjq9j" data-rowspan="1" data-colspan="1"><br/></p></td>`,
          '</tr>',
          `<tr data-row="row-929dk8">`,
          `<td data-row="row-929dk8" rowspan="1" colspan="1"><p class="qlbt-cell-line" data-row="row-929dk8" data-cell="cell-lj7h6y" data-rowspan="1" data-colspan="1"><br/></p></td>`,
          `<td data-row="row-929dk8" rowspan="1" colspan="1"><p class="qlbt-cell-line" data-row="row-929dk8" data-cell="cell-l0enbj" data-rowspan="1" data-colspan="1"><br/></p></td>`,
          `<td data-row="row-929dk8" rowspan="1" colspan="1"><p class="qlbt-cell-line" data-row="row-929dk8" data-cell="cell-xa4lb9" data-rowspan="1" data-colspan="1"><br/></p></td>`,
          '</tr>',
          `<tr data-row="row-j95olh">`,
          `<td data-row="row-j95olh" rowspan="1" colspan="1"><p class="qlbt-cell-line" data-row="row-j95olh" data-cell="cell-2w5wjp" data-rowspan="1" data-colspan="1"><br/></p></td>`,
          `<td data-row="row-j95olh" rowspan="1" colspan="1"><p class="qlbt-cell-line" data-row="row-j95olh" data-cell="cell-o7q92h" data-rowspan="1" data-colspan="1"><br/></p></td>`,
          `<td data-row="row-j95olh" rowspan="1" colspan="1"><p class="qlbt-cell-line" data-row="row-j95olh" data-cell="cell-4nujo2" data-rowspan="1" data-colspan="1"><br/></p></td>`,
          '</tr>',
          `</tbody>`,
          `</table>`,
          `</div>`,
        ].join('')
      );
    });

    it('should render single cell cu-table', () => {
      let ops = [
        {
          attributes: {
            'table-col': { width: '150' },
          },
          insert: '\n',
        },
        {
          attributes: {
            'table-cell-line': {
              rowspan: '1',
              colspan: '1',
              row: 'row-rcydzq',
              cell: 'cell-fqmunc',
            },
            row: 'row-rcydzq',
            rowspan: '1',
            colspan: '1',
          },
          insert: '\n',
        },
      ];

      let qdc = new QuillDeltaToHtmlConverter(ops);
      assert.equal(
        qdc.convert(),
        [
          `<div class="clickup-table-view">`,
          `<table class="clickup-table" style="width: 150px">`,
          `<colgroup>`,
          `<col width="150">`,
          `</colgroup>`,
          `<tbody>`,
          `<tr data-row="row-rcydzq">`,
          `<td data-row="row-rcydzq" rowspan="1" colspan="1">`,
          `<p class="qlbt-cell-line" data-row="row-rcydzq" data-cell="cell-fqmunc" data-rowspan="1" data-colspan="1"><br/></p></td>`,
          `</tr>`,
          `</tbody>`,
          `</table>`,
          `</div>`,
        ].join('')
      );
    });

    it('should render filled cu-table', () => {
      let ops = [
        {
          attributes: {
            'table-col': { width: '150' },
          },
          insert: '\n\n',
        },
        {
          attributes: {
            'table-col': { width: '200' },
          },
          insert: '\n',
        },
        {
          insert: 'cell-1-line-1',
        },
        {
          attributes: {
            'table-cell-line': {
              rowspan: '1',
              colspan: '1',
              row: 'row-dvagmt',
              cell: 'cell-383p7o',
            },
            row: 'row-dvagmt',
            rowspan: '1',
            colspan: '1',
          },
          insert: '\n',
        },
        {
          insert: 'cell-1-line-2',
        },
        {
          attributes: {
            'table-cell-line': {
              rowspan: '1',
              colspan: '1',
              row: 'row-dvagmt',
              cell: 'cell-383p7o',
            },
            row: 'row-dvagmt',
            rowspan: '1',
            colspan: '1',
          },
          insert: '\n',
        },
        {
          insert: 'cell-2-line-1',
        },
        {
          attributes: {
            'table-cell-line': {
              rowspan: '1',
              colspan: '1',
              row: 'row-dvagmt',
              cell: 'cell-kdrmch',
            },
            row: 'row-dvagmt',
            rowspan: '1',
            colspan: '1',
          },
          insert: '\n',
        },
        {
          insert: 'cell-3-line-1',
        },
        {
          attributes: {
            'table-cell-line': {
              rowspan: '1',
              colspan: '1',
              row: 'row-dvagmt',
              cell: 'cell-ljjq9j',
            },
            row: 'row-dvagmt',
            rowspan: '1',
            colspan: '1',
          },
          insert: '\n',
        },
        {
          insert: 'cell-4-line-1',
        },
        {
          attributes: {
            'table-cell-line': {
              rowspan: '1',
              colspan: '1',
              row: 'row-929dk8',
              cell: 'cell-lj7h6y',
            },
            row: 'row-929dk8',
            rowspan: '1',
            colspan: '1',
          },
          insert: '\n',
        },
        {
          insert: 'cell-5-line-1',
        },
        {
          attributes: {
            'table-cell-line': {
              rowspan: '1',
              colspan: '1',
              row: 'row-929dk8',
              cell: 'cell-l0enbj',
            },
            row: 'row-929dk8',
            rowspan: '1',
            colspan: '1',
          },
          insert: '\n',
        },
        {
          insert: 'cell-6-line-1',
        },
        {
          attributes: {
            'table-cell-line': {
              rowspan: '1',
              colspan: '1',
              row: 'row-929dk8',
              cell: 'cell-xa4lb9',
            },
            row: 'row-929dk8',
            rowspan: '1',
            colspan: '1',
          },
          insert: '\n',
        },
        {
          insert: 'cell-7-line-1',
        },
        {
          attributes: {
            'table-cell-line': {
              rowspan: '1',
              colspan: '1',
              row: 'row-j95olh',
              cell: 'cell-2w5wjp',
            },
            row: 'row-j95olh',
            rowspan: '1',
            colspan: '1',
          },
          insert: '\n',
        },
        {
          insert: 'cell-8-line-1',
        },
        {
          attributes: {
            'table-cell-line': {
              rowspan: '1',
              colspan: '1',
              row: 'row-j95olh',
              cell: 'cell-o7q92h',
            },
            row: 'row-j95olh',
            rowspan: '1',
            colspan: '1',
          },
          insert: '\n',
        },
        {
          insert: 'cell-9-line-1',
        },
        {
          attributes: {
            'table-cell-line': {
              rowspan: '1',
              colspan: '1',
              row: 'row-j95olh',
              cell: 'cell-4nujo2',
            },
            row: 'row-j95olh',
            rowspan: '1',
            colspan: '1',
          },
          insert: '\n',
        },
      ];

      let qdc = new QuillDeltaToHtmlConverter(ops);
      assert.equal(
        qdc.convert(),
        [
          `<div class="clickup-table-view">`,
          `<table class="clickup-table" style="width: 500px">`,
          `<colgroup>`,
          `<col width="150"><col width="150"><col width="200">`,
          `</colgroup>`,
          `<tbody>`,
          `<tr data-row="row-dvagmt">`,
          `<td data-row="row-dvagmt" rowspan="1" colspan="1"><p class="qlbt-cell-line" data-row="row-dvagmt" data-cell="cell-383p7o" data-rowspan="1" data-colspan="1">cell-1-line-1</p><p class="qlbt-cell-line" data-row="row-dvagmt" data-cell="cell-383p7o" data-rowspan="1" data-colspan="1">cell-1-line-2</p></td>`,
          `<td data-row="row-dvagmt" rowspan="1" colspan="1"><p class="qlbt-cell-line" data-row="row-dvagmt" data-cell="cell-kdrmch" data-rowspan="1" data-colspan="1">cell-2-line-1</p></td>`,
          `<td data-row="row-dvagmt" rowspan="1" colspan="1"><p class="qlbt-cell-line" data-row="row-dvagmt" data-cell="cell-ljjq9j" data-rowspan="1" data-colspan="1">cell-3-line-1</p></td>`,
          '</tr>',
          `<tr data-row="row-929dk8">`,
          `<td data-row="row-929dk8" rowspan="1" colspan="1"><p class="qlbt-cell-line" data-row="row-929dk8" data-cell="cell-lj7h6y" data-rowspan="1" data-colspan="1">cell-4-line-1</p></td>`,
          `<td data-row="row-929dk8" rowspan="1" colspan="1"><p class="qlbt-cell-line" data-row="row-929dk8" data-cell="cell-l0enbj" data-rowspan="1" data-colspan="1">cell-5-line-1</p></td>`,
          `<td data-row="row-929dk8" rowspan="1" colspan="1"><p class="qlbt-cell-line" data-row="row-929dk8" data-cell="cell-xa4lb9" data-rowspan="1" data-colspan="1">cell-6-line-1</p></td>`,
          '</tr>',
          `<tr data-row="row-j95olh">`,
          `<td data-row="row-j95olh" rowspan="1" colspan="1"><p class="qlbt-cell-line" data-row="row-j95olh" data-cell="cell-2w5wjp" data-rowspan="1" data-colspan="1">cell-7-line-1</p></td>`,
          `<td data-row="row-j95olh" rowspan="1" colspan="1"><p class="qlbt-cell-line" data-row="row-j95olh" data-cell="cell-o7q92h" data-rowspan="1" data-colspan="1">cell-8-line-1</p></td>`,
          `<td data-row="row-j95olh" rowspan="1" colspan="1"><p class="qlbt-cell-line" data-row="row-j95olh" data-cell="cell-4nujo2" data-rowspan="1" data-colspan="1">cell-9-line-1</p></td>`,
          '</tr>',
          `</tbody>`,
          `</table>`,
          `</div>`,
        ].join('')
      );
    });

    it('should render table with merged cell and empty row', () => {
      const ops = [
        { insert: '\n\n\n', attributes: { 'table-col': { width: '150' } } },
        { insert: '1' },
        {
          insert: '\n',
          attributes: {
            'table-cell-line': {
              rowspan: '2',
              colspan: '1',
              row: '1',
              cell: '1',
            },
            row: '1',
            cell: '1',
            rowspan: '2',
            colspan: '1',
          },
        },
        { insert: '2' },
        {
          insert: '\n',
          attributes: {
            'table-cell-line': {
              rowspan: '3',
              colspan: '1',
              row: '1',
              cell: '2',
            },
            row: '1',
            cell: '2',
            rowspan: '3',
            colspan: '1',
          },
        },
        { insert: '3' },
        {
          insert: '\n',
          attributes: {
            'table-cell-line': {
              rowspan: '4',
              colspan: '1',
              row: '1',
              cell: '3',
            },
            row: '1',
            cell: '3',
            rowspan: '4',
            colspan: '1',
          },
        },
        {
          insert: { hidden_table_cell: '2' },
          attributes: { renderAsBlock: true },
        },
        { insert: '4' },
        {
          insert: '\n',
          attributes: {
            'table-cell-line': {
              rowspan: '1',
              colspan: '1',
              row: '3',
              cell: '4',
            },
            row: '3',
            cell: '4',
            rowspan: '1',
            colspan: '1',
          },
        },
        { insert: '5' },
        {
          insert: '\n',
          attributes: {
            'table-cell-line': {
              rowspan: '1',
              colspan: '1',
              row: '4',
              cell: '5',
            },
            row: '4',
            cell: '5',
            rowspan: '1',
            colspan: '1',
          },
        },
        { insert: '6' },
        {
          insert: '\n',
          attributes: {
            'table-cell-line': {
              rowspan: '1',
              colspan: '1',
              row: '5',
              cell: '6',
            },
            row: '5',
            cell: '6',
            rowspan: '1',
            colspan: '1',
          },
        },
      ];

      let qdc = new QuillDeltaToHtmlConverter(ops);
      assert.equal(
        qdc.convert(),
        [
          `<div class="clickup-table-view">`,
          `<table class="clickup-table" style="width: 450px">`,
          `<colgroup><col width="150"><col width="150"><col width="150"></colgroup>`,
          `<tbody>`,
          `<tr data-row="1">`,
          `<td data-row="1" rowspan="2" colspan="1"><p class="qlbt-cell-line" data-row="1" data-cell="1" data-rowspan="2" data-colspan="1">1</p></td>`,
          `<td data-row="1" rowspan="3" colspan="1"><p class="qlbt-cell-line" data-row="1" data-cell="2" data-rowspan="3" data-colspan="1">2</p></td>`,
          `<td data-row="1" rowspan="4" colspan="1"><p class="qlbt-cell-line" data-row="1" data-cell="3" data-rowspan="4" data-colspan="1">3</p></td>`,
          `</tr>`,
          `<tr data-row="2"><td data-row="2" rowspan colspan></td></tr>`,
          `<tr data-row="3">`,
          `<td data-row="3" rowspan="1" colspan="1"><p class="qlbt-cell-line" data-row="3" data-cell="4" data-rowspan="1" data-colspan="1">4</p></td>`,
          `</tr>`,
          `<tr data-row="4">`,
          `<td data-row="4" rowspan="1" colspan="1"><p class="qlbt-cell-line" data-row="4" data-cell="5" data-rowspan="1" data-colspan="1">5</p></td>`,
          `</tr>`,
          `<tr data-row="5">`,
          `<td data-row="5" rowspan="1" colspan="1"><p class="qlbt-cell-line" data-row="5" data-cell="6" data-rowspan="1" data-colspan="1">6</p></td>`,
          `</tr>`,
          `</tbody>`,
          `</table>`,
          `</div>`,
        ].join('')
      );
    });

    // test cases for refactored cu-table
    it('should render empty cu-table', () => {
      let ops = [
        {
          attributes: {
            'table-col': { width: '150' },
          },
          insert: '\n\n\n',
        },
        {
          attributes: {
            'table-cell-line': {
              rowspan: '1',
              colspan: '1',
              row: 'row-dvagmt',
              cell: 'cell-383p7o',
            },
          },
          insert: '\n',
        },
        {
          attributes: {
            'table-cell-line': {
              rowspan: '1',
              colspan: '1',
              row: 'row-dvagmt',
              cell: 'cell-kdrmch',
            },
          },
          insert: '\n',
        },
        {
          attributes: {
            'table-cell-line': {
              rowspan: '1',
              colspan: '1',
              row: 'row-dvagmt',
              cell: 'cell-ljjq9j',
            },
          },
          insert: '\n',
        },
        {
          attributes: {
            'table-cell-line': {
              rowspan: '1',
              colspan: '1',
              row: 'row-929dk8',
              cell: 'cell-lj7h6y',
            },
          },
          insert: '\n',
        },
        {
          attributes: {
            'table-cell-line': {
              rowspan: '1',
              colspan: '1',
              row: 'row-929dk8',
              cell: 'cell-l0enbj',
            },
          },
          insert: '\n',
        },
        {
          attributes: {
            'table-cell-line': {
              rowspan: '1',
              colspan: '1',
              row: 'row-929dk8',
              cell: 'cell-xa4lb9',
            },
          },
          insert: '\n',
        },
        {
          attributes: {
            'table-cell-line': {
              rowspan: '1',
              colspan: '1',
              row: 'row-j95olh',
              cell: 'cell-2w5wjp',
            },
          },
          insert: '\n',
        },
        {
          attributes: {
            'table-cell-line': {
              rowspan: '1',
              colspan: '1',
              row: 'row-j95olh',
              cell: 'cell-o7q92h',
            },
          },
          insert: '\n',
        },
        {
          attributes: {
            'table-cell-line': {
              rowspan: '1',
              colspan: '1',
              row: 'row-j95olh',
              cell: 'cell-4nujo2',
            },
          },
          insert: '\n',
        },
      ];

      let qdc = new QuillDeltaToHtmlConverter(ops);
      assert.equal(
        qdc.convert(),
        [
          `<div class="clickup-table-view">`,
          `<table class="clickup-table" style="width: 450px">`,
          `<colgroup>`,
          `<col width="150"><col width="150"><col width="150">`,
          `</colgroup>`,
          `<tbody>`,
          `<tr data-row="row-dvagmt">`,
          `<td data-row="row-dvagmt" rowspan="1" colspan="1"><p class="qlbt-cell-line" data-row="row-dvagmt" data-cell="cell-383p7o" data-rowspan="1" data-colspan="1"><br/></p></td>`,
          `<td data-row="row-dvagmt" rowspan="1" colspan="1"><p class="qlbt-cell-line" data-row="row-dvagmt" data-cell="cell-kdrmch" data-rowspan="1" data-colspan="1"><br/></p></td>`,
          `<td data-row="row-dvagmt" rowspan="1" colspan="1"><p class="qlbt-cell-line" data-row="row-dvagmt" data-cell="cell-ljjq9j" data-rowspan="1" data-colspan="1"><br/></p></td>`,
          '</tr>',
          `<tr data-row="row-929dk8">`,
          `<td data-row="row-929dk8" rowspan="1" colspan="1"><p class="qlbt-cell-line" data-row="row-929dk8" data-cell="cell-lj7h6y" data-rowspan="1" data-colspan="1"><br/></p></td>`,
          `<td data-row="row-929dk8" rowspan="1" colspan="1"><p class="qlbt-cell-line" data-row="row-929dk8" data-cell="cell-l0enbj" data-rowspan="1" data-colspan="1"><br/></p></td>`,
          `<td data-row="row-929dk8" rowspan="1" colspan="1"><p class="qlbt-cell-line" data-row="row-929dk8" data-cell="cell-xa4lb9" data-rowspan="1" data-colspan="1"><br/></p></td>`,
          '</tr>',
          `<tr data-row="row-j95olh">`,
          `<td data-row="row-j95olh" rowspan="1" colspan="1"><p class="qlbt-cell-line" data-row="row-j95olh" data-cell="cell-2w5wjp" data-rowspan="1" data-colspan="1"><br/></p></td>`,
          `<td data-row="row-j95olh" rowspan="1" colspan="1"><p class="qlbt-cell-line" data-row="row-j95olh" data-cell="cell-o7q92h" data-rowspan="1" data-colspan="1"><br/></p></td>`,
          `<td data-row="row-j95olh" rowspan="1" colspan="1"><p class="qlbt-cell-line" data-row="row-j95olh" data-cell="cell-4nujo2" data-rowspan="1" data-colspan="1"><br/></p></td>`,
          '</tr>',
          `</tbody>`,
          `</table>`,
          `</div>`,
        ].join('')
      );
    });

    it('should render table with list', () => {
      let ops = [
        {
          attributes: {
            'table-col': { width: '150' },
          },
          insert: '\n\n',
        },
        {
          attributes: {
            'table-cell-line': {
              rowspan: '1',
              colspan: '1',
              row: 'row-dvagmt',
              cell: 'cell-383p7o',
            },
          },
          insert: '\n',
        },
        {
          attributes: {
            list: {
              rowspan: '1',
              colspan: '1',
              row: 'row-dvagmt',
              cell: 'cell-383p7o',
              list: 'bullet',
            },
          },
          insert: '\n',
        },
        {
          attributes: {
            'table-cell-line': {
              rowspan: '1',
              colspan: '1',
              row: 'row-dvagmt',
              cell: 'cell-kdrmch',
            },
          },
          insert: '\n',
        },
        {
          attributes: {
            'table-cell-line': {
              rowspan: '1',
              colspan: '1',
              row: 'row-929dk8',
              cell: 'cell-lj7h6y',
            },
          },
          insert: '\n',
        },
        {
          attributes: {
            'table-cell-line': {
              rowspan: '1',
              colspan: '1',
              row: 'row-929dk8',
              cell: 'cell-l0enbj',
            },
          },
          insert: '\n',
        },
        {
          attributes: {
            list: {
              rowspan: '1',
              colspan: '1',
              row: 'row-929dk8',
              cell: 'cell-l0enbj',
              list: 'ordered',
            },
          },
          insert: '\n',
        },
      ];

      let qdc = new QuillDeltaToHtmlConverter(ops);
      assert.equal(
        qdc.convert(),
        [
          `<div class="clickup-table-view">`,
          `<table class="clickup-table" style="width: 300px">`,
          `<colgroup>`,
          `<col width="150"><col width="150">`,
          `</colgroup>`,
          `<tbody>`,
          `<tr data-row="row-dvagmt">`,
          `<td data-row="row-dvagmt" rowspan="1" colspan="1">`,
          `<p class="qlbt-cell-line" data-row="row-dvagmt" data-cell="cell-383p7o" data-rowspan="1" data-colspan="1"><br/></p>`,
          `<ul data-row="row-dvagmt" data-cell="cell-383p7o" data-rowspan="1" data-colspan="1"><li><p><br/></p></li></ul>`,
          `</td>`,
          `<td data-row="row-dvagmt" rowspan="1" colspan="1"><p class="qlbt-cell-line" data-row="row-dvagmt" data-cell="cell-kdrmch" data-rowspan="1" data-colspan="1"><br/></p></td>`,
          '</tr>',
          `<tr data-row="row-929dk8">`,
          `<td data-row="row-929dk8" rowspan="1" colspan="1"><p class="qlbt-cell-line" data-row="row-929dk8" data-cell="cell-lj7h6y" data-rowspan="1" data-colspan="1"><br/></p></td>`,
          `<td data-row="row-929dk8" rowspan="1" colspan="1">`,
          `<p class="qlbt-cell-line" data-row="row-929dk8" data-cell="cell-l0enbj" data-rowspan="1" data-colspan="1"><br/></p>`,
          `<ol data-row="row-929dk8" data-cell="cell-l0enbj" data-rowspan="1" data-colspan="1"><li><p><br/></p></li></ol>`,
          `</td>`,
          '</tr>',
          `</tbody>`,
          `</table>`,
          `</div>`,
        ].join('')
      );
    });

    it('should render table with align text', () => {
      const ops = [
        {
          attributes: {
            'table-col': { width: '150' },
          },
          insert: '\n\n',
        },
        { insert: 'align text' },
        {
          attributes: {
            'table-cell-line': {
              rowspan: '1',
              colspan: '1',
              row: 'row-dvagmt',
              cell: 'cell-383p7o',
            },
            align: 'center',
          },
          insert: '\n',
        },
        {
          attributes: {
            list: {
              rowspan: '1',
              colspan: '1',
              row: 'row-dvagmt',
              cell: 'cell-495b7o',
              list: 'ordered',
            },
          },
          insert: '\n',
        },
      ];
      const qdc = new QuillDeltaToHtmlConverter(ops);
      assert.equal(
        qdc.convert(),
        [
          `<div class="clickup-table-view">`,
          `<table class="clickup-table" style="width: 300px">`,
          `<colgroup>`,
          `<col width="150"><col width="150">`,
          `</colgroup>`,
          `<tbody>`,
          `<tr data-row="row-dvagmt">`,
          `<td data-row="row-dvagmt" rowspan="1" colspan="1">`,
          `<p class="ql-align-center qlbt-cell-line" data-row="row-dvagmt" data-cell="cell-383p7o" data-rowspan="1" data-colspan="1">align text</p>`,
          `</td>`,
          `<td data-row="row-dvagmt" rowspan="1" colspan="1">`,
          `<ol data-row="row-dvagmt" data-cell="cell-495b7o" data-rowspan="1" data-colspan="1"><li><p><br/></p></li></ol>`,
          `</td>`,
          '</tr>',
          `</tbody>`,
          `</table>`,
          `</div>`,
        ].join('')
      );
    });

    // test cases for columns
    it('should render columns with row width', () => {
      let ops = [
        {
          insert: 'column 1',
        },
        {
          insert: '\n',
          attributes: {
            layout:
              'd5669c0e-2118-4641-8a5b-a62dec27dcc8_0b9022e4-7eea-4cf1-86de-91ca824dcbe7',
            'layout-row-width': '0.8',
          },
        },
        {
          insert: 'column 2',
        },
        {
          insert: '\n',
          attributes: {
            layout:
              'd5669c0e-2118-4641-8a5b-a62dec27dcc8_02676960-343e-4723-a07d-6429aedcf166',
            'layout-row-width': '0.8',
          },
        },
      ];

      let qdc = new QuillDeltaToHtmlConverter(ops);
      assert.equal(
        qdc.convert(),
        [
          `<div class="ql-layout-row-container" style="width: 80%; max-width: 100%;">`,
          `<div class="ql-layout-col-container" data-layout-align="top"><p>column 1</p></div>`,
          `<div class="ql-layout-col-container" data-layout-align="top"><p>column 2</p></div>`,
          `</div>`,
        ].join('')
      );
    });

    it('should render columns with list', () => {
      let ops = [
        {
          insert: 'column 1',
        },
        {
          insert: '\n',
          attributes: {
            layout:
              'd5669c0e-2118-4641-8a5b-a62dec27dcc8_0b9022e4-7eea-4cf1-86de-91ca824dcbe7',
          },
        },
        {
          insert: 'column 2',
        },
        {
          insert: '\n',
          attributes: {
            layout:
              'd5669c0e-2118-4641-8a5b-a62dec27dcc8_02676960-343e-4723-a07d-6429aedcf166',
            list: {
              list: 'ordered',
            },
          },
        },
        {
          insert: 'column 1',
        },
        {
          insert: '\n',
          attributes: {
            list: {
              list: 'ordered',
            },
          },
        },
      ];

      let qdc = new QuillDeltaToHtmlConverter(ops);
      assert.equal(
        qdc.convert(),
        [
          `<div class="ql-layout-row-container">`,
          `<div class="ql-layout-col-container" data-layout-align="top"><p>column 1</p></div>`,
          `<div class="ql-layout-col-container" data-layout-align="top">`,
          `<ol><li><p>column 2</p></li></ol>`,
          `</div>`,
          `</div>`,
          `<ol><li><p>column 1</p></li></ol>`,
        ].join('')
      );
    });

    it('should render columns with different lists', () => {
      let ops = [
        {
          insert: 'column 1',
        },
        {
          insert: '\n',
          attributes: {
            layout:
              'd5669c0e-2118-4641-8a5b-a62dec27dcc8_0b9022e4-7eea-4cf1-86de-91ca824dcbe7',
          },
        },
        {
          insert: 'column 1',
        },
        {
          insert: '\n',
          attributes: {
            layout:
              'd5669c0e-2118-4641-8a5b-a62dec27dcc8_0b9022e4-7eea-4cf1-86de-91ca824dcbe7',
            list: {
              list: 'ordered',
            },
          },
        },
        {
          insert: 'column 2',
        },
        {
          insert: '\n',
          attributes: {
            layout:
              'd5669c0e-2118-4641-8a5b-a62dec27dcc8_02676960-343e-4723-a07d-6429aedcf166',
            list: {
              list: 'ordered',
            },
          },
        },
      ];

      let qdc = new QuillDeltaToHtmlConverter(ops);
      assert.equal(
        qdc.convert(),
        [
          `<div class="ql-layout-row-container">`,
          `<div class="ql-layout-col-container" data-layout-align="top">`,
          `<p>column 1</p>`,
          `<ol><li><p>column 1</p></li></ol>`,
          `</div>`,
          `<div class="ql-layout-col-container" data-layout-align="top">`,
          `<ol><li><p>column 2</p></li></ol>`,
          `</div>`,
          `</div>`,
        ].join('')
      );
    });

    // test cases for advanced banner
    it('should render advanced banner', () => {
      const ops = [
        {
          insert: 'line',
        },
        {
          insert: '\n',
          attributes: {
            'advanced-banner': 'test-banner-id',
            'advanced-banner-color': 'green',
          },
        },
        {
          insert: 'list',
        },
        {
          insert: '\n',
          attributes: {
            'advanced-banner': 'test-banner-id',
            'advanced-banner-color': 'green',
            list: { list: 'bullet' },
          },
        },
      ];

      const qdc = new QuillDeltaToHtmlConverter(ops);
      assert.equal(
        qdc.convert(),
        [
          `<div class="ql-advanced-banner" data-advanced-banner-color="green">`,
          `<p>line</p>`,
          `<ul><li><p>list</p></li></ul>`,
          `</div>`,
        ].join('')
      );
    });

    it('should render advanced banner nested in list', () => {
      const ops = [
        {
          insert: 'root list',
        },
        {
          insert: '\n',
          attributes: {
            list: { list: 'bullet' },
          },
        },
        {
          insert: 'list banner',
        },
        {
          insert: '\n',
          attributes: {
            'advanced-banner': 'test-banner-id',
            'advanced-banner-color': 'green',
            'advanced-banner-in-list': 'bullet',
            'advanced-banner-list-indent': '1',
          },
        },
        {
          insert: 'list banner list',
        },
        {
          insert: '\n',
          attributes: {
            list: { list: 'bullet' },
            'advanced-banner': 'test-banner-id',
            'advanced-banner-color': 'green',
            'advanced-banner-in-list': 'bullet',
            'advanced-banner-list-indent': '1',
          },
        },
      ];
      const qdc = new QuillDeltaToHtmlConverter(ops);
      assert.equal(
        qdc.convert(),
        [
          `<ul><li><p>root list</p>`,
          `<li data-none-type="true">`,
          `<div class="ql-advanced-banner" data-advanced-banner-color="green">`,
          `<p>list banner</p>`,
          `<ul><li><p>list banner list</p></li></ul>`,
          `</div>`,
          `</li></li></ul>`,
        ].join('')
      );
    });

    it('should render banner in column', () => {
      const ops = [
        {
          insert: 'green banner in column 1',
        },
        {
          insert: '\n',
          attributes: {
            'advanced-banner': 'test-banner-id-1',
            'advanced-banner-color': 'green',
            layout:
              'd5669c0e-2118-4641-8a5b-a62dec27dcc8_0b9022e4-7eea-4cf1-86de-91ca82455555',
          },
        },
        {
          insert: 'red banner in column 2',
        },
        {
          insert: '\n',
          attributes: {
            'advanced-banner': 'test-banner-id-2',
            'advanced-banner-color': 'red',
            layout:
              'd5669c0e-2118-4641-8a5b-a62dec27dcc8_0b9022e4-7eea-4cf1-86de-91ca824dcbe7',
          },
        },
      ];

      const qdc = new QuillDeltaToHtmlConverter(ops);
      assert.equal(
        qdc.convert(),
        [
          `<div class="ql-layout-row-container">`,
          `<div class="ql-layout-col-container" data-layout-align="top">`,
          `<div class="ql-advanced-banner" data-advanced-banner-color="green">`,
          `<p>green banner in column 1</p>`,
          `</div>`,
          `</div>`,
          `<div class="ql-layout-col-container" data-layout-align="top">`,
          `<div class="ql-advanced-banner" data-advanced-banner-color="red">`,
          `<p>red banner in column 2</p>`,
          `</div>`,
          `</div>`,
          `</div>`,
        ].join('')
      );
    });

    it('should escape html code while rendering code blocks in list', () => {
      const ops = [
        { insert: 'hello this is a list.', attributes: {} },
        { insert: '\n', attributes: { list: { list: 'bullet' } } },
        { insert: 'code block 1', attributes: {} },
        {
          attributes: {
            'code-block': { 'code-block': 'javascript', 'in-list': 'bullet' },
          },
          insert: '\n',
        },
        { insert: 'code block 2', attributes: {} },
        {
          attributes: {
            'code-block': { 'code-block': 'javascript', 'in-list': 'bullet' },
          },
          insert: '\n',
        },
      ];

      const qdc = new QuillDeltaToHtmlConverter(ops, {
        blocksCanBeWrappedWithList: ['code-block'],
      });
      assert.equal(
        qdc.convert(),
        [
          `<ul>` +
            `<li><p>hello this is a list.</p></li>` +
            `<li data-none-type=\"true\"><pre data-language=\"javascript\">code block 1\ncode block 2</pre></li>` +
            `</ul>`,
        ].join('')
      );
    });
  });

  describe('custom types', () => {
    it(`should return empty string if renderer not defined for
                           custom blot`, () => {
      let ops = [{ insert: { customstuff: 'my val' } }];
      let qdc = new QuillDeltaToHtmlConverter(ops);
      assert.equal(qdc.convert(), '<p></p>');
    });
    it('should render custom insert types with given renderer', () => {
      let ops = [
        { insert: { bolditalic: 'my text' } },
        { insert: { blah: 1 } },
      ];
      let qdc = new QuillDeltaToHtmlConverter(ops);
      qdc.renderCustomWith((op) => {
        if (op.insert.type === 'bolditalic') {
          return '<b><i>' + op.insert.value + '</i></b>';
        }
        return 'unknown';
      });
      let html = qdc.convert();
      assert.equal(html, '<p><b><i>my text</i></b>unknown</p>');
    });

    it('should render custom insert types as blocks if renderAsBlock is specified', () => {
      let ops = [
        { insert: 'hello ' },
        { insert: { myblot: 'my friend' } },
        { insert: '!' },
        { insert: { myblot: 'how r u?' }, attributes: { renderAsBlock: true } },
      ];
      let qdc = new QuillDeltaToHtmlConverter(ops);
      qdc.renderCustomWith((op) => {
        if (op.insert.type === 'myblot') {
          return op.attributes.renderAsBlock
            ? '<div>' + op.insert.value + '</div>'
            : op.insert.value;
        }
        return 'unknown';
      });
      let html = qdc.convert();
      assert.equal(html, '<p>hello my friend!</p><div>how r u?</div>');
    });

    it('should render custom insert types in code blocks with given renderer', () => {
      let ops = [
        { insert: { colonizer: ':' } },
        { insert: '\n', attributes: { 'code-block': true } },
        { insert: 'code1' },
        { insert: '\n', attributes: { 'code-block': true } },
        { insert: { colonizer: ':' } },
        { insert: '\n', attributes: { 'code-block': true } },
      ];
      let renderer = (op: DeltaInsertOp) => {
        if (op.insert.type === 'colonizer') {
          return op.insert.value;
        }
        return '';
      };
      let qdc = new QuillDeltaToHtmlConverter(ops.slice(0, 2));
      qdc.renderCustomWith(renderer);
      assert.equal(qdc.convert(), '<pre>:</pre>');

      qdc = new QuillDeltaToHtmlConverter(ops);
      qdc.renderCustomWith(renderer);
      assert.equal(qdc.convert(), '<pre>:\ncode1\n:</pre>');

      qdc = new QuillDeltaToHtmlConverter(ops, {
        customTag: (format) => {
          if (format === 'code-block') {
            return 'code';
          }
        },
      });
      qdc.renderCustomWith(renderer);
      assert.equal(qdc.convert(), '<code>:\ncode1\n:</code>');
    });

    it('should render custom insert types in headers with given renderer', () => {
      let ops = [
        { insert: { colonizer: ':' } },
        { insert: '\n', attributes: { header: 1 } },
        { insert: 'hello' },
        { insert: '\n', attributes: { header: 1 } },
        { insert: { colonizer: ':' } },
        { insert: '\n', attributes: { header: 1 } },
      ];
      let renderer = (op: DeltaInsertOp) => {
        if (op.insert.type === 'colonizer') {
          return op.insert.value;
        }
        return '';
      };
      let qdc = new QuillDeltaToHtmlConverter(ops.slice(0, 2));
      qdc.renderCustomWith(renderer);
      assert.equal(qdc.convert(), '<h1>:</h1>');

      qdc = new QuillDeltaToHtmlConverter(ops);
      qdc.renderCustomWith(renderer);
      assert.equal(qdc.convert(), '<h1>:<br/>hello<br/>:</h1>');
    });
  });

  describe('_getListTag()', function () {
    it('should return proper list tag', function () {
      var op = new DeltaInsertOp('\n', { list: { list: ListType.Ordered } });
      var qdc = new QuillDeltaToHtmlConverter(delta1.ops);
      assert.equal(qdc._getListTag(op), 'ol');

      var op = new DeltaInsertOp('\n', { list: { list: ListType.Bullet } });
      assert.equal(qdc._getListTag(op), 'ul');

      var op = new DeltaInsertOp('\n', { list: { list: ListType.Checked } });
      assert.equal(qdc._getListTag(op), 'ul');

      var op = new DeltaInsertOp('\n', { list: { list: ListType.Unchecked } });
      assert.equal(qdc._getListTag(op), 'ul');

      var op = new DeltaInsertOp('d');
      assert.equal(qdc._getListTag(op), '');
    });
  });

  describe(' prepare data before inline and block renders', function () {
    var ops: any;
    beforeEach(function () {
      ops = [
        { insert: 'Hello' },
        { insert: ' my ', attributes: { italic: true } },
        { insert: '\n', attributes: { italic: true } },
        { insert: ' name is joey' },
      ].map((v: any) => new DeltaInsertOp(v.insert, v.attributes));
    });

    describe('renderInlines()', function () {
      it('should render inlines', function () {
        var qdc = new QuillDeltaToHtmlConverter([]);
        var inlines = qdc._renderInlines(ops);
        assert.equal(
          inlines,
          ['<p>Hello', '<em> my </em><br/> name is joey</p>'].join('')
        );

        qdc = new QuillDeltaToHtmlConverter([], { paragraphTag: 'div' });
        var inlines = qdc._renderInlines(ops);
        assert.equal(
          inlines,
          '<div>Hello<em> my </em><br/> name is joey</div>'
        );

        qdc = new QuillDeltaToHtmlConverter([], { paragraphTag: '' });
        var inlines = qdc._renderInlines(ops);
        assert.equal(inlines, 'Hello<em> my </em><br/> name is joey');
      });

      it('should render inlines custom tag', function () {
        var qdc = new QuillDeltaToHtmlConverter([], {
          customTag: (format) => {
            if (format === 'italic') {
              return 'i';
            }
          },
        });
        var inlines = qdc._renderInlines(ops);
        assert.equal(
          inlines,
          ['<p>Hello', '<i> my </i><br/> name is joey</p>'].join('')
        );

        qdc = new QuillDeltaToHtmlConverter([], { paragraphTag: 'div' });
        var inlines = qdc._renderInlines(ops);
        assert.equal(
          inlines,
          '<div>Hello<em> my </em><br/> name is joey</div>'
        );

        qdc = new QuillDeltaToHtmlConverter([], { paragraphTag: '' });
        var inlines = qdc._renderInlines(ops);
        assert.equal(inlines, 'Hello<em> my </em><br/> name is joey');
      });

      it('should render plain new line string', function () {
        var ops = [new DeltaInsertOp('\n')];
        var qdc = new QuillDeltaToHtmlConverter([]);
        assert.equal(qdc._renderInlines(ops), '<p><br/></p>');
      });

      it('should render styled new line string', function () {
        var ops = [new DeltaInsertOp('\n', { font: 'arial' })];
        var qdc = new QuillDeltaToHtmlConverter([]);
        assert.equal(qdc._renderInlines(ops), '<p><br/></p>');

        var qdc = new QuillDeltaToHtmlConverter([], { paragraphTag: '' });
        assert.equal(qdc._renderInlines(ops), '<br/>');
      });

      it('should render when first line is new line', function () {
        var ops = [new DeltaInsertOp('\n'), new DeltaInsertOp('aa')];
        var qdc = new QuillDeltaToHtmlConverter([]);
        assert.equal(qdc._renderInlines(ops), '<p><br/>aa</p>');
      });

      it('should render when last line is new line', function () {
        var ops = [new DeltaInsertOp('aa'), new DeltaInsertOp('\n')];
        var qdc = new QuillDeltaToHtmlConverter([]);
        assert.equal(qdc._renderInlines(ops), '<p>aa</p>');
      });

      it('should render mixed lines', function () {
        var ops = [new DeltaInsertOp('aa'), new DeltaInsertOp('bb')];
        var nlop = new DeltaInsertOp('\n');
        var stylednlop = new DeltaInsertOp('\n', {
          color: '#333',
          italic: true,
        });
        var qdc = new QuillDeltaToHtmlConverter([]);
        assert.equal(qdc._renderInlines(ops), '<p>aabb</p>');

        var ops0 = [nlop, ops[0], nlop, ops[1]];
        assert.equal(qdc._renderInlines(ops0), '<p><br/>aa<br/>bb</p>');

        var ops4 = [ops[0], stylednlop, stylednlop, stylednlop, ops[1]];
        assert.equal(
          qdc._renderInlines(ops4),
          ['<p>aa<br/><br/><br/>bb</p>'].join('')
        );
      });
    });

    describe('renderBlock()', function () {
      var op = new DeltaInsertOp('\n', { header: 3, indent: 2 });
      var inlineop = new DeltaInsertOp('hi there');
      it('should render container block', function () {
        var qdc = new QuillDeltaToHtmlConverter([]);
        var blockhtml = qdc._renderBlock(op, [inlineop]);
        assert.equal(
          blockhtml,
          ['<h3 class="ql-indent-2">', 'hi there</h3>'].join('')
        );

        var qdc = new QuillDeltaToHtmlConverter([]);
        var blockhtml = qdc._renderBlock(op, []);
        assert.equal(
          blockhtml,
          ['<h3 class="ql-indent-2">', '<br/></h3>'].join('')
        );
      });

      it('should correctly render code block', function () {
        let ops = [
          {
            insert: 'line 1',
          },
          {
            attributes: {
              'code-block': { 'code-block': true },
            },
            insert: '\n',
          },
          {
            insert: 'line 2',
          },
          {
            attributes: {
              'code-block': { 'code-block': true },
            },
            insert: '\n',
          },
          {
            insert: 'line 3',
          },
          {
            attributes: {
              'code-block': { 'code-block': 'javascript' },
            },
            insert: '\n',
          },
          {
            insert: '<p>line 4</p>',
          },
          {
            attributes: {
              'code-block': true,
            },
            insert: '\n',
          },
          {
            insert: 'line 5',
          },
          {
            attributes: {
              'code-block': { 'code-block': 'ja"va' },
            },
            insert: '\n',
          },
        ];
        //console.log(encodeHtml("<p>line 4</p>"));
        var qdc = new QuillDeltaToHtmlConverter(ops);
        let html = qdc.convert();
        assert.equal(
          html,
          [
            '<pre>line 1\nline 2</pre>',
            '<pre data-language="javascript">line 3</pre>',
            '<pre>',
            encodeHtml('<p>line 4</p>'),
            '\nline 5' + '</pre>',
          ].join('')
        );

        qdc = new QuillDeltaToHtmlConverter(ops, {
          multiLineCodeblock: false,
        });
        html = qdc.convert();
        assert.equal(
          '<pre>line 1</pre><pre>line 2</pre>' +
            '<pre data-language="javascript">line 3</pre>' +
            '<pre>' +
            encodeHtml('<p>line 4</p>') +
            '</pre>' +
            '<pre>line 5</pre>',
          html
        );
        qdc = new QuillDeltaToHtmlConverter([ops[0], ops[1]]);
        html = qdc.convert();
        assert.equal(html, '<pre>line 1</pre>');
      });
    });

    it('should correctly render custom text block', function () {
      let ops = [
        {
          insert: 'line 1',
        },
        {
          attributes: {
            renderAsBlock: true,
            attr1: true,
          },
          insert: '\n',
        },
        {
          insert: 'line 2',
        },
        {
          attributes: {
            renderAsBlock: true,
            attr1: true,
          },
          insert: '\n',
        },
        {
          insert: 'line 3',
        },
        {
          attributes: {
            renderAsBlock: true,
            attr2: true,
          },
          insert: '\n',
        },
        {
          insert: '<p>line 4</p>',
        },
        {
          attributes: {
            renderAsBlock: true,
            attr1: true,
          },
          insert: '\n',
        },
        {
          insert: 'line 5',
        },
        {
          attributes: {
            renderAsBlock: true,
            attr1: 'test',
          },
          insert: '\n',
        },
        {
          insert: 'line 6',
        },
        {
          attributes: {
            renderAsBlock: true,
            attr1: true,
            ignore: 1,
          },
          insert: '\n',
        },
        {
          insert: 'line 7',
        },
        {
          attributes: {
            renderAsBlock: true,
            attr1: true,
            ignore: 2,
          },
          insert: '\n',
        },
      ];
      //console.log(encodeHtml("<p>line 4</p>"));
      var qdc = new QuillDeltaToHtmlConverter(ops, {
        customTag: (format, op) => {
          if (format === 'renderAsBlock' && op.attributes['attr1'] === 'test') {
            return 'test';
          }
        },
        customTagAttributes: (op) => {
          if (op.attributes['attr1'] === 'test') {
            return {
              attr1: op.attributes['attr1'],
            };
          }
        },
        customCssClasses: (op) => {
          if (op.attributes['attr1'] === 'test') {
            return ['ql-test'];
          }
        },
        customCssStyles: (op) => {
          if (op.attributes['attr1'] === 'test') {
            return ['color:red'];
          }
        },
        customBlockIsEqual: (g: BlockGroup, gOther: BlockGroup) => {
          return (
            g.op.isCustomTextBlock() &&
            gOther.op.isCustomTextBlock() &&
            isEqual(
              {
                ...g.op.attributes,
                ignore: undefined,
              },
              {
                ...gOther.op.attributes,
                ignore: undefined,
              }
            )
          );
        },
      });
      let html = qdc.convert();
      assert.equal(
        html,
        [
          '<p>line 1<br/>line 2</p>',
          '<p>line 3</p>',
          '<p>',
          encodeHtml('<p>line 4</p>'),
          '</p>',
          '<test attr1="test" class="ql-test" style="color:red">line 5</test>',
          '<p>line 6<br/>line 7</p>',
        ].join('')
      );

      qdc = new QuillDeltaToHtmlConverter(ops, {
        multiLineCustomBlock: false,
      });
      html = qdc.convert();
      assert.equal(
        '<p>line 1</p><p>line 2</p>' +
          '<p>line 3</p>' +
          '<p>' +
          encodeHtml('<p>line 4</p>') +
          '</p>' +
          '<p>line 5</p><p>line 6</p><p>line 7</p>',
        html
      );
      qdc = new QuillDeltaToHtmlConverter([ops[0], ops[1]]);
      html = qdc.convert();
      assert.equal(html, '<p>line 1</p>');
    });

    describe('before n after renders()', function () {
      var ops = [
        { insert: 'hello', attributes: { bold: true } },
        { insert: '\n', attributes: { bold: true } },
        { insert: 'how r u?' },
        { insert: 'r u fine' },
        { insert: '\n', attributes: { blockquote: {} } },
        { insert: { video: 'http://' } },
        { insert: 'list item 1' },
        { insert: '\n', attributes: { list: { list: 'bullet' } } },
        { insert: 'list item 1 indented' },
        { insert: '\n', attributes: { list: { list: 'bullet' }, indent: 1 } },
      ];
      var qdc = new QuillDeltaToHtmlConverter(ops);

      it('should call before/after render callbacks ', function (done) {
        let status = { x: 0, y: 8 };
        qdc.beforeRender((groupType, data) => {
          if (groupType === GroupType.InlineGroup) {
            var op = (<any>data).ops[0];
            assert.ok(op.attributes.bold);
          } else if (groupType === GroupType.Video) {
            var op = (<any>data).op;
            assert.ok(op.insert.type === 'video');
          } else if (groupType === GroupType.Block) {
            var d = <any>data;
            assert.ok(d.op.attributes.blockquote && d.ops.length === 2);
          } else {
            var d = <any>data;
            assert.ok(d.items.length === 1);
          }
          status.x++;
          return '';
        });
        qdc.afterRender((groupType, data, html) => {
          if (groupType === GroupType.InlineGroup) {
            assert.ok(html.indexOf('<strong>hello') > -1);
          } else if (groupType === GroupType.Video) {
            assert.ok(html.indexOf('<iframe') > -1);
          } else if (groupType === GroupType.Block) {
            assert.ok(html.indexOf('<blockquote') > -1);
            var d = <any>data;
            assert.ok(d.op.attributes.blockquote && d.ops.length === 2);
          } else {
            assert.ok(html.indexOf('list item 1</p><ul><li') > -1);
          }
          status.x++;
          return html;
        });
        qdc.convert();
        callWhenXEqualY(status, done);
      });

      it(`should call before render with block grouptype for align
                  indent and direction`, (done) => {
        let ops = [
          { insert: 'align' },
          { insert: '\n', attributes: { align: 'right' } },
          { insert: 'rtl' },
          { insert: '\n', attributes: { direction: 'rtl' } },
          { insert: 'indent 1' },
          { insert: '\n', attributes: { indent: 1 } },
        ];
        let status = { x: 0, y: 3 };
        let qdc = new QuillDeltaToHtmlConverter(ops);
        qdc.beforeRender((gtype: any) => {
          gtype === 'block' && status.x++;
          return '';
        });
        qdc.convert();
        callWhenXEqualY(status, done);
      });

      it('should use my custom html if I return from before call back', function () {
        var c = new QuillDeltaToHtmlConverter([
          { insert: { video: 'http' } },
          { insert: 'aa' },
        ]);
        c.beforeRender(() => {
          return '<my custom video html>';
        });
        var v = c.convert();
        assert.ok(v.indexOf('<my custom') > -1);
      });

      it('use default renderer in custom renderer', function () {
        var ops = [
          { insert: 'bb', attributes: { bold: true } },
          { insert: 'aa' },
        ];
        var c1 = new QuillDeltaToHtmlConverter(ops);
        c1.beforeRender((t, d, renderer) => {
          return t == 'inline-group' && d instanceof InlineGroup
            ? '<custom>' + renderer() + '</custom>'
            : renderer();
        });
        var c2 = new QuillDeltaToHtmlConverter(ops);
        assert.equal(c1.convert(), '<custom>' + c2.convert() + '</custom>');
      });

      it('should register and use callbacks if they are functions', function () {
        var c = new QuillDeltaToHtmlConverter([
          { insert: { video: 'http' } },
          { insert: 'aa' },
        ]);
        var dummy = (): any => '';

        c.beforeRender(dummy());
        c.afterRender(dummy());
        v = c.convert();
        assert.ok(v.indexOf('iframe') > -1);

        c.beforeRender(dummy);
        var v = c.convert();
        assert.ok(v.indexOf('<iframe') > -1 && v.indexOf('aa') > -1);

        c.afterRender(dummy);
        v = c.convert();
        assert.ok(v === '');
      });

      it('should create blockquote within list', function () {
        var qdc = new QuillDeltaToHtmlConverter(
          [
            { insert: 'first line\nfirst list item parent' },
            { attributes: { list: { list: 'ordered' } }, insert: '\n' },
            { insert: 'child list item' },
            {
              attributes: { indent: 1, list: { list: 'ordered' } },
              insert: '\n',
            },
            { insert: 'blockq' },
            {
              attributes: {
                blockquote: { 'in-list': 'true', 'wrapper-indent': '1' },
              },
              insert: '\n',
            },
            { insert: 'aaa' },
            { attributes: { list: { list: 'ordered' } }, insert: '\n' },
            { insert: 'bbb' },
            {
              attributes: {
                blockquote: { 'in-list': 'true', 'wrapper-indent': '3' },
              },
              insert: '\n',
            },
            { insert: 'ccc' },
            {
              attributes: {
                blockquote: { 'in-list': 'true', 'wrapper-indent': '3' },
              },
              insert: '\n',
            },
            { insert: '\n' },
          ],
          {
            blocksCanBeWrappedWithList: ['blockquote'],
          }
        );

        var html = qdc.convert();
        assert.equal(
          html,
          [
            '<p>first line</p>',
            '<ol>',
            '<li><p>first list item parent</p>',
            '<ol>',
            '<li><p>child list item</p></li>',
            '<li data-none-type="true">',
            '<blockquote><p>blockq</p></blockquote>',
            '</li>',
            '</ol>',
            '</li>',
            '<li><p>aaa</p>',
            '<li data-empty-block="true">',
            '<li data-empty-block="true">',
            '<ul><li data-none-type="true">',
            '<blockquote><p>bbb<br/>ccc</p></blockquote>',
            '</li></ul>',
            '</li>',
            '</li>',
            '</li>',
            '</ol>',
            '<p><br/></p>',
          ].join('')
        );
      });

      it('should create block embed within list', function () {
        const ops = [
          {
            insert: { custom: true },
            attributes: { custom: { 'in-list': 'none' }, renderAsBlock: true },
          },
          {
            insert: { custom: true },
            attributes: {
              custom: { 'in-list': 'bullet' },
              renderAsBlock: true,
            },
          },
          {
            insert: { custom: true },
            attributes: {
              custom: { 'in-list': 'ordered', 'display-list-type': 'true' },
              renderAsBlock: true,
            },
          },
          {
            insert: { custom: true },
            attributes: {
              custom: { 'in-list': 'checked', 'display-list-type': 'true' },
              'block-id': 'test-block-id',
              renderAsBlock: true,
            },
          },
          {
            insert: { custom: true },
            attributes: {
              custom: { 'in-list': 'unchecked', 'display-list-type': 'false' },
              renderAsBlock: true,
            },
          },
        ];
        const qdc = new QuillDeltaToHtmlConverter(ops, {
          blocksCanBeWrappedWithList: ['custom'],
        });
        qdc.renderCustomWith((op) => {
          if (op.insert.type === 'custom') {
            return '<div>Custom embed</div>';
          }
          return 'unknown';
        });
        let html = qdc.convert();
        assert.equal(
          html,
          '<ul><li data-none-type="true"><div>Custom embed</div></li><li data-none-type="true"><div>Custom embed</div></li><li class="ql-rendered-ordered-list"><div>Custom embed</div></li><li class="ql-rendered-checked-list" data-checked="true" data-block-id="test-block-id"><div>Custom embed</div></li><li data-none-type="true"><div>Custom embed</div></li></ul>'
        );
      });
    });
  });

  describe('mergeEmptyLines', () => {
    it('should behave nomally', () => {
      const ops = [
        { insert: 'line1', attributes: {} },
        {
          insert: '\n',
          attributes: {
            'block-id': 'block-5b7feb38-adb1-4b44-aa69-42d90c6e2e00',
          },
        },
        {
          insert: '\n',
          attributes: {
            'block-id': 'block-de1b5382-8c99-41c9-97df-8d927aac907b',
          },
        },
        { insert: 'line2', attributes: {} },
        {
          insert: '\n',
          attributes: {
            'block-id': 'block-2fa3c7e6-a1ef-45fb-83c7-9833dc0f2606',
          },
        },
      ];
      const qdc = new QuillDeltaToHtmlConverter(ops, {
        multiLineParagraph: false,
        multiLineHeader: false,
        multiLineCustomBlock: true,
        mergeEmptyLines: true,
      });
      const html = qdc.convert();
      assert.equal(html, '<p>line1</p><p><br/></p><p>line2</p>');
    });

    it('should merge multiple lines', () => {
      const ops = [
        { insert: 'line1', attributes: {} },
        {
          insert: '\n',
          attributes: {
            'block-id': 'block-5b7feb38-adb1-4b44-aa69-42d90c6e2e00',
          },
        },
        {
          insert: '\n',
          attributes: {
            'block-id': 'block-5b7feb38-adb1-4b44-aa69-42d90c6e2e00',
          },
        },
        {
          insert: '\n',
          attributes: {
            'block-id': 'block-de1b5382-8c99-41c9-97df-8d927aac907b',
          },
        },
        { insert: 'line2', attributes: {} },
        {
          insert: '\n',
          attributes: {
            'block-id': 'block-2fa3c7e6-a1ef-45fb-83c7-9833dc0f2606',
          },
        },
      ];
      const qdc = new QuillDeltaToHtmlConverter(ops, {
        multiLineParagraph: false,
        multiLineHeader: false,
        multiLineCustomBlock: true,
        mergeEmptyLines: true,
      });
      const html = qdc.convert();
      assert.equal(html, '<p>line1</p><p><br/></p><p>line2</p>');
    });

    it("should add class to linebreaks' container", () => {
      const ops = [
        { insert: 'line1', attributes: {} },
        {
          insert: '\n',
          attributes: {
            'block-id': 'block-5b7feb38-adb1-4b44-aa69-42d90c6e2e00',
          },
        },
        {
          insert: '\n',
          attributes: {
            'block-id': 'block-5b7feb38-adb1-4b44-aa69-42d90c6e2e00',
          },
        },
        {
          insert: '\n',
          attributes: {
            'block-id': 'block-de1b5382-8c99-41c9-97df-8d927aac907b',
          },
        },
        { insert: 'line2', attributes: {} },
        {
          insert: '\n',
          attributes: {
            'block-id': 'block-2fa3c7e6-a1ef-45fb-83c7-9833dc0f2606',
          },
        },
      ];
      const qdc = new QuillDeltaToHtmlConverter(ops, {
        multiLineParagraph: false,
        multiLineHeader: false,
        multiLineCustomBlock: true,
        mergeEmptyLines: true,
        linebreakBlockClassName: 'ql-linebreak-container',
      });
      const html = qdc.convert();
      assert.equal(
        html,
        '<p>line1</p><p class="ql-linebreak-container"><br/></p><p>line2</p>'
      );
    });

    it('should preserve linebreaks for code block', () => {
      const ops = [
        { insert: 'fasdf', attributes: {} },
        {
          insert: '\n',
          attributes: {
            'block-id': 'block-81f0e1be-3e2e-44a9-8cc6-dc7308563849',
            'code-block': {
              'code-block': 'plain',
              'code-block-line-numbers': 'false',
            },
          },
        },
        {
          insert: '\n',
          attributes: {
            'block-id': 'block-37b02bf2-c32c-45cb-a084-5ef6d561a740',
            'code-block': {
              'code-block': 'plain',
              'code-block-line-numbers': 'false',
            },
          },
        },
        {
          insert: '\n',
          attributes: {
            'block-id': 'block-bbebb048-0ca7-4002-b6ea-c436d104f009',
            'code-block': {
              'code-block': 'plain',
              'code-block-line-numbers': 'false',
            },
          },
        },
        { insert: 'fasdfasdf', attributes: {} },
        {
          insert: '\n',
          attributes: {
            'block-id': 'block-3549d879-2687-45d4-a1b2-33be06001ce1',
            'code-block': {
              'code-block': 'plain',
              'code-block-line-numbers': 'false',
            },
          },
        },
        { insert: 'asdf', attributes: {} },
        {
          insert: '\n',
          attributes: {
            'block-id': 'block-2f2c11bf-9569-46ba-b8b4-8614cf52e4e9',
          },
        },
      ];
      const qdc = new QuillDeltaToHtmlConverter(ops, {
        multiLineParagraph: false,
        multiLineHeader: false,
        multiLineCustomBlock: true,
        mergeEmptyLines: true,
      });
      const html = qdc.convert();
      assert.equal(
        html,
        `<pre data-language="plain">fasdf


fasdfasdf</pre><p>asdf</p>`
      );
    });

    it('should merge lines in quote', () => {
      const ops = [
        { insert: 'asdf', attributes: {} },
        {
          insert: '\n',
          attributes: {
            'block-id': 'block-dfe32e0c-d47d-4607-89f5-d0a2b0033dcd',
            blockquote: {},
          },
        },
        {
          insert: '\n',
          attributes: {
            'block-id': 'block-8b218d86-9274-48a0-b9dd-06a6c1c5a6c9',
            blockquote: {},
          },
        },
        {
          insert: '\n',
          attributes: {
            'block-id': 'block-f783f36b-c994-4976-89b3-7d6150440226',
            blockquote: {},
          },
        },
        {
          insert: '\n',
          attributes: {
            'block-id': 'block-ab20c98d-1b0d-49f5-ad61-a743c7549e49',
            blockquote: {},
          },
        },
        { insert: 'fasdf', attributes: {} },
        {
          insert: '\n',
          attributes: {
            'block-id': 'block-24c2de52-c0d2-4f60-af3e-a85b9e2cf8a6',
            blockquote: {},
          },
        },
        { insert: 'fasdf', attributes: {} },
        {
          insert: '\n',
          attributes: {
            'block-id': 'block-124583ce-c283-4af9-a496-40325a09fa6e',
          },
        },
      ];
      const qdc = new QuillDeltaToHtmlConverter(ops, {
        multiLineParagraph: false,
        multiLineHeader: false,
        multiLineCustomBlock: true,
        mergeEmptyLines: true,
      });
      const html = qdc.convert();
      assert.equal(
        html,
        '<blockquote>asdf<br/><br/>fasdf</blockquote><p>fasdf</p>'
      );
    });

    it('should add class in linebreak after list', () => {
      const ops = [
        { insert: 'line1', attributes: {} },
        {
          insert: '\n',
          attributes: {
            'block-id': 'block-9c5f8d12-eb4f-40d7-9875-2bc96a8f2ea9',
            list: { list: 'bullet' },
          },
        },
        { insert: 'line2', attributes: {} },
        {
          insert: '\n',
          attributes: {
            'block-id': 'block-bf0ed33d-bcf4-483c-b073-663d61dac6c2',
            list: { list: 'bullet' },
          },
        },
        {
          insert: '\n',
          attributes: {
            'block-id': 'block-7c494390-719b-421e-b4c6-bcd30ce523ee',
          },
        },
        { insert: 'o', attributes: {} },
        {
          insert: '\n',
          attributes: {
            'block-id': 'block-eef85a06-205e-4c00-90d8-d4af2975b419',
          },
        },
      ];
      const qdc = new QuillDeltaToHtmlConverter(ops, {
        multiLineParagraph: false,
        multiLineHeader: false,
        multiLineCustomBlock: true,
        mergeEmptyLines: true,
        linebreakBlockClassName: 'ql-linebreak-container',
      });
      const html = qdc.convert();
      assert.equal(
        html,
        '<ul><li><p>line1</p></li><li><p>line2</p></li></ul><p class="ql-linebreak-container"><br/></p><p>o</p>'
      );
    });

    it('should add class in linebreak under list item', () => {
      const ops = [
        {
          insert: 'Test:',
          attributes: {},
        },
        {
          insert: '\n',
          attributes: {
            'block-id': 'block-8a9002ac-d7fd-400b-ad19-3b92c8d41e78',
          },
        },
        {
          insert: '1',
          attributes: {},
        },
        {
          insert: '\n',
          attributes: {
            list: {
              list: 'bullet',
            },
            'block-id': 'block-54c1128b-5cf4-407d-9ec3-9bac98efd2f2',
          },
        },
        {
          insert: '2',
          attributes: {},
        },
        {
          insert: '\n',
          attributes: {
            list: {
              list: 'bullet',
            },
            'block-id': 'block-7a75ef52-d480-4123-966b-7e222cc7b663',
          },
        },
        {
          insert: '\n',
          attributes: {
            list: {
              list: 'none',
            },
            'block-id': 'block-17ec2b57-bd5e-4ed4-a649-c11dfe93f4b0',
          },
        },
        {
          insert: 'b',
          attributes: {},
        },
        {
          insert: '\n',
          attributes: {
            list: {
              list: 'none',
            },
            'block-id': 'block-d7ef5fc8-32db-4372-9d2a-a2d38480e0bd',
          },
        },
        {
          insert: '3',
          attributes: {},
        },
        {
          insert: '\n',
          attributes: {
            list: {
              list: 'bullet',
            },
            'block-id': 'block-6cf7e1d9-9f11-417b-a2ec-f4fae0297041',
          },
        },
      ];
      const qdc = new QuillDeltaToHtmlConverter(ops, {
        multiLineParagraph: false,
        multiLineHeader: false,
        multiLineCustomBlock: true,
        linebreakBlockClassName: 'ql-linebreak-container',
      });
      const html = qdc.convert();
      assert.equal(
        html,
        '<p>Test:</p><ul><li><p>1</p></li><li><p>2</p></li><li><p class="ql-linebreak-container"><br/></p></li><li><p>b</p></li><li><p>3</p></li></ul>'
      );
    });

    it('should remove beginning lines', () => {
      const ops = [
        {
          insert: '\n',
          attributes: {
            'block-id': 'block-294dab12-1fc8-406b-bf41-f045ad8c42a1',
          },
        },
        {
          insert: '\n',
          attributes: {
            'block-id': 'block-294dab12-1fc8-406b-bf41-f045ad8c42a9',
          },
        },
        { insert: 'fas', attributes: {} },
        {
          insert: '\n',
          attributes: {
            'block-id': 'block-d3eb1962-fdf2-4d11-99c4-6d23149d2899',
          },
        },
      ];
      const qdc = new QuillDeltaToHtmlConverter(ops, {
        multiLineParagraph: false,
        multiLineHeader: false,
        multiLineCustomBlock: true,
        mergeEmptyLines: true,
        linebreakBlockClassName: 'ql-linebreak-container',
      });
      const html = qdc.convert();
      assert.equal(html, '<p>fas</p>');
    });
  });
});

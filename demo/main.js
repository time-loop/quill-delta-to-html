import { QuillDeltaToHtmlConverter } from '../src/QuillDeltaToHtmlConverter'
// with new table
// var delta = {"ops":[{"insert":"\n"},{"attributes":{"table-col":{"width":"150"}},"insert":"\n\n"},{"insert":"234324"},{"attributes":{"table-cell-line":{"rowspan":"1","colspan":"1","row":"row-vog0hb","cell":"cell-te8iog"},"row":"row-vog0hb","rowspan":"1","colspan":"1"},"insert":"\n"},{"insert":"324324"},{"attributes":{"table-cell-line":{"rowspan":"1","colspan":"1","row":"row-vog0hb","cell":"cell-leoqv7"},"row":"row-vog0hb","rowspan":"1","colspan":"1"},"insert":"\n"},{"insert":"234"},{"attributes":{"table-cell-line":{"rowspan":"1","colspan":"1","row":"row-f01cl4","cell":"cell-usqwfp"},"row":"row-f01cl4","rowspan":"1","colspan":"1"},"insert":"\n"},{"insert":"213132312"},{"attributes":{"table-cell-line":{"rowspan":"1","colspan":"1","row":"row-f01cl4","cell":"cell-usqwfp"},"row":"row-f01cl4","rowspan":"1","colspan":"1"},"insert":"\n"},{"insert":"234234"},{"attributes":{"table-cell-line":{"rowspan":"1","colspan":"1","row":"row-f01cl4","cell":"cell-i5xnig"},"row":"row-f01cl4","rowspan":"1","colspan":"1"},"insert":"\n"},{"insert":"123123123"},{"attributes":{"table-cell-line":{"rowspan":"1","colspan":"1","row":"row-f01cl4","cell":"cell-i5xnig"},"row":"row-f01cl4","rowspan":"1","colspan":"1"},"insert":"\n"},{"insert":"\n"}]}
// with new table and new list into table
var delta = {"ops":[{"insert":"\n"},{"attributes":{"table-col":{"width":"150"}},"insert":"\n\n\n"},{"insert":"131233"},{"attributes":{"list":{"rowspan":"1","colspan":"1","row":"row-urpq0b","cell":"cell-hocr5a","list":"ordered"},"rowspan":"1","colspan":"1","row":"row-urpq0b","cell":"cell-hocr5a"},"insert":"\n"},{"insert":"12313"},{"attributes":{"list":{"rowspan":"1","colspan":"1","row":"row-urpq0b","cell":"cell-hocr5a","list":"ordered"},"rowspan":"1","colspan":"1","row":"row-urpq0b","cell":"cell-hocr5a"},"insert":"\n"},{"insert":"123"},{"attributes":{"list":{"rowspan":"1","colspan":"1","row":"row-urpq0b","cell":"cell-hocr5a","list":"ordered"},"rowspan":"1","colspan":"1","row":"row-urpq0b","cell":"cell-hocr5a"},"insert":"\n"},{"insert":"123123"},{"attributes":{"table-cell-line":{"rowspan":"1","colspan":"1","row":"row-urpq0b","cell":"cell-hocr5a"},"row":"row-urpq0b","rowspan":"1","colspan":"1"},"insert":"\n"},{"insert":"123123"},{"attributes":{"table-cell-line":{"rowspan":"1","colspan":"1","row":"row-urpq0b","cell":"cell-dlowr3"},"row":"row-urpq0b","rowspan":"1","colspan":"1"},"insert":"\n"},{"insert":"123123"},{"attributes":{"table-cell-line":{"rowspan":"1","colspan":"1","row":"row-urpq0b","cell":"cell-dlowr3"},"row":"row-urpq0b","rowspan":"1","colspan":"1"},"insert":"\n"},{"insert":"12313"},{"attributes":{"table-cell-line":{"rowspan":"1","colspan":"1","row":"row-urpq0b","cell":"cell-lug6ha"},"row":"row-urpq0b","rowspan":"1","colspan":"1"},"insert":"\n"},{"insert":"123"},{"attributes":{"table-cell-line":{"rowspan":"1","colspan":"1","row":"row-hhh8fl","cell":"cell-3t8jee"},"row":"row-hhh8fl","rowspan":"1","colspan":"1"},"insert":"\n"},{"insert":"123"},{"attributes":{"table-cell-line":{"rowspan":"1","colspan":"1","row":"row-hhh8fl","cell":"cell-l7nu97"},"row":"row-hhh8fl","rowspan":"1","colspan":"1"},"insert":"\n"},{"insert":"123123"},{"attributes":{"table-cell-line":{"rowspan":"1","colspan":"1","row":"row-hhh8fl","cell":"cell-tzi4lz"},"row":"row-hhh8fl","rowspan":"1","colspan":"1"},"insert":"\n"},{"insert":"\n"}]}
// with new list
var delta1 = {"ops":[{"insert":"sdflk"},{"attributes":{"bold":true},"insert":"sjflk"},{"insert":"jssfsdfsf\nsdfsdfsdf\nsdfsdfsdfsdfsdf"},{"attributes":{"list":{"list":"ordered"}},"insert":"\n"},{"insert":"sdfsdf"},{"attributes":{"list":{"list":"ordered"}},"insert":"\n"},{"insert":"sdfdsfdsf"},{"attributes":{"list":{"list":"ordered"}},"insert":"\n"},{"insert":"sdfsdf"},{"attributes":{"list":{"list":"ordered"}},"insert":"\n"},{"insert":"sdfsdfsf\nsdfsd\nfsdfsdsdffsdfsdf\nsdfsf\n"},{"attributes":{"link":"www.baidu.com"},"insert":"www.baidu.com"},{"insert":"\n"}]}
var testDelta = {"ops":[{"insert":"\n"},{"attributes":{"table-col":{"width":"150"}},"insert":"\n"},{"attributes":{"table-cell-line":{"rowspan":"1","colspan":"1","row":"row-rcydzq","cell":"cell-fqmunc"},"row":"row-rcydzq","rowspan":"1","colspan":"1"},"insert":"\n"},{"insert":"\n"}]}
// with check list
var checklistDelta = {"ops":[{"insert":"sdfsdfsdf"},{"attributes":{"list":{"list":"unchecked"}},"insert":"\n"},{"insert":"dsfsd"},{"attributes":{"indent":1,"list":{"list":"unchecked"}},"insert":"\n"},{"insert":"sdfsfs"},{"attributes":{"indent":1,"list":{"list":"unchecked"}},"insert":"\n"},{"insert":"sdfsfsdf"},{"attributes":{"indent":1,"list":{"list":"unchecked"}},"insert":"\n"}]}
// with toggle list
var togglelistDelta = {"ops":[{"insert":"dsfsfsfs"},{"attributes":{"list":{"list":"toggled"}},"insert":"\n"},{"insert":"sdfdsfsf"},{"attributes":{"list":{"list":"toggled"}},"insert":"\n"},{"insert":"sdfsdfdf"},{"attributes":{"indent":1,"list":{"list":"toggled"}},"insert":"\n"},{"insert":"dsfdsfdsf"},{"attributes":{"indent":1,"list":{"list":"toggled"}},"insert":"\n"},{"insert":"sdfdsfdsf"},{"attributes":{"indent":2,"list":{"list":"toggled"}},"insert":"\n"},{"insert":"sdfsfsdf"},{"attributes":{"indent":2,"list":{"list":"toggled"}},"insert":"\n"},{"insert":"sdfdsfsdf"},{"attributes":{"indent":1,"list":{"list":"toggled"}},"insert":"\n"},{"insert":"sdfsdfdsf"},{"attributes":{"indent":1,"list":{"list":"toggled"}},"insert":"\n"}]}
// list within blockquote
var listWithinBlockquote = {"ops":[{"insert":"first line\nfirst list item parent"},{"attributes":{"list":{"list":"ordered"}},"insert":"\n"},{"insert":"child list item"},{"attributes":{"indent":1,"list":{"list":"ordered"}},"insert":"\n"},{"insert":"blockq"},{"attributes":{"blockquote":{"in-list":"true","wrapper-indent":"1"}},"insert":"\n"},{"insert":"aaa"},{"attributes":{"list":{"list":"ordered"}},"insert":"\n"},{"insert":"bbb"},{"attributes":{"blockquote":{"in-list":"true","wrapper-indent":"3"}},"insert":"\n"},{"insert":"ccc"},{"attributes":{"blockquote":{"in-list":"true","wrapper-indent":"3"}},"insert":"\n"},{"insert":"\n"}]};
// list within code blocks
var listWithinCodeBlock = {"ops":[{"insert":"function foo() { return false; }"},{"attributes":{"code-block":{"code-block":"javascript"}},"insert":"\n"},{"insert":"dsfdsfdsf"},{"attributes":{"list":{"list":"ordered"}},"insert":"\n"},{"insert":"sdfdsfdsfdsf"},{"attributes":{"code-block":{"code-block":"plain","in-list":"none"}},"insert":"\n"},{"insert":"sdfdsfdsfdsf"},{"attributes":{"code-block":{"code-block":"plain","in-list":"none"}},"insert":"\n"}]}
// Mixing various lists
var mixingList = {"ops":[{"insert":"sdfsdf"},{"insert":"\n","attributes":{"list":{"list":"ordered"},"id":"1t582p16h"}},{"insert":"dsfdfdsfdsfd"},{"insert":"\n","attributes":{"banner":{"banner":"success","in-list":"ordered"}, 'renderAsBlock': true}},{"insert":"sdfdsf"},{"insert":"\n","attributes":{"list":{"list":"ordered"},"id":"xqsmv5der"}},{"insert":{"bookmark":{"url":"https://www.google.com/","service":"custom","title":"Google","description":"undefined","thumbnail":null,"favicon":"https://www.google.com/s2/favicons?domain_url=https%3A%2F%2Fwww.google.com%2F","updated":"true"}},"attributes":{"bookmark": { "in-list":"ordered" }, "renderAsBlock": true}},{"insert":"dsfdfsfsdfsf"},{"insert":"\n","attributes":{"list":{"list":"ordered"},"id":"48spy2qd1"}}]}
// Continue lists
var continueListWithQuote = {"ops": [{"insert":"dfsfsf","attributes":{}},{"insert":"\n","attributes":{"list":{"list":"ordered"}}},{"insert":"fdsffsdfs","attributes":{}},{"insert":"\n","attributes":{"indent":1,"list":{"list":"ordered"}}},{"insert":"dsfdsfdsf","attributes":{}},{"insert":"\n","attributes":{"indent":2,"list":{"list":"ordered"}}},{"insert":"dsfsdfsdfsdfdsfdsf","attributes":{}},{"insert":"\n"},{"insert":"sdfdsfdsffsdf","attributes":{}},{"insert":"\n","attributes":{"blockquote":{"in-list":"ordered","wrapper-indent":"2","counters":"{\"0\":1,\"1\":1,\"2\":1,\"3\":0,\"4\":0,\"5\":0,\"6\":0,\"7\":0,\"8\":0}"}}},{"insert":"dsfdsf","attributes":{}},{"insert":"\n","attributes":{"indent":2,"list":{"list":"ordered","counters":"{\"0\":1,\"1\":1,\"2\":1,\"3\":0,\"4\":0,\"5\":0,\"6\":0,\"7\":0,\"8\":0}"}}},{"insert":"sdfdsfdsf","attributes":{}},{"insert":"\n","attributes":{"indent":1,"list":{"list":"ordered","counters":"{\"0\":1,\"1\":1,\"2\":1,\"3\":0,\"4\":0,\"5\":0,\"6\":0,\"7\":0,\"8\":0}"}}}]};


var qdc = new QuillDeltaToHtmlConverter(continueListWithQuote.ops, {
  multiLineParagraph: false,
  multiLineHeader: false,
  blocksCanBeWrappedWithList: ['blockquote', 'code-block', 'banner', 'bookmark'],
  customTagAttributes: (op) => {
    const attrs = {};

    if (op.attributes && op.attributes['list']) {
      if (op.attributes['list'] && op.attributes['list'].list === 'none') {
        attrs['data-none-type'] = true;
      }
    }

    if (op.attributes && op.attributes['block-id']) {
      attrs['data-block-id'] = op.attributes['block-id'];
    }

    return attrs;
  },
  customListGroupAttrs: (g, isRootListGroup) => {
    const listAttrs = [];

    if (isRootListGroup) {
      listAttrs.push({
        key: 'data-is-root',
        value: 'true',
      });
    }

    if (isRootListGroup && g.counters) {
      const countersMap = JSON.parse(g.counters);
      listAttrs.push({
        key: 'style',
        value: `counter-reset:${Object.keys(countersMap)
          .map((key) => {
            return ' list-' + key + ' ' + countersMap[key];
          })
          .join('')}`,
      });
    }

    if (g.isEmptyNest) {
      listAttrs.push({
        key: 'data-empty-nest',
        value: 'true',
      });
    }

    return listAttrs;
  }
});

qdc.renderCustomWith((customOp, contextOp) => {
  if (customOp.insert.type === 'bookmark') {
    return [
      '<div class="ql-bookmark">',
      `bookmark`,
      '</div>',
    ].join('')
  }
})

var html = qdc.convert();
document.getElementById('converted-view').innerHTML = html;
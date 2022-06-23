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
var continueList1 = { "ops": [{"insert":"111"},{"insert":"\n","attributes":{"list":{"list":"ordered"},"block-id":"block-c4987847-bc5a-4a48-b48f-d22db70e38bf"}},{"insert":"qqq"},{"insert":"\n","attributes":{"block-id":"block-e586854e-838a-4a4b-9d78-a6b995ae2503"}},{"insert":"222"},{"insert":"\n","attributes":{"list":{"list":"ordered","counters":"{\"0\":1,\"1\":0,\"2\":0,\"3\":0,\"4\":0,\"5\":0,\"6\":0,\"7\":0,\"8\":0}"},"indent":1,"block-id":"block-1ba90f83-9f2a-468e-8ec4-3f319fb82e06"}},{"insert":"333"},{"insert":"\n","attributes":{"list":{"list":"ordered","counters":"{\"0\":1,\"1\":0,\"2\":0,\"3\":0,\"4\":0,\"5\":0,\"6\":0,\"7\":0,\"8\":0}"},"indent":2,"block-id":"block-007f77d2-71b3-40e4-9f29-7e20e1352d6e"}},{"insert":"ppp"},{"insert":"\n","attributes":{"block-id":"block-e3a83d42-bb9c-4736-9657-3cb5bf7cb079"}},{"insert":"444"},{"insert":"\n","attributes":{"list":{"list":"ordered","counters":"{\"0\":1,\"1\":1,\"2\":1,\"3\":0,\"4\":0,\"5\":0,\"6\":0,\"7\":0,\"8\":0}"},"indent":2,"block-id":"block-0d76edc3-18a8-4bd2-b98b-e989d0f5d387"}},{"insert":"555"},{"insert":"\n","attributes":{"list":{"list":"ordered","counters":"{\"0\":1,\"1\":1,\"2\":1,\"3\":0,\"4\":0,\"5\":0,\"6\":0,\"7\":0,\"8\":0}"},"indent":2,"block-id":"block-8f8817bf-f19f-4c72-8363-61b4167a6320"}}] };
// table within lists
var tableWithLists = { "ops": [{"insert":"\n","attributes":{"block-id":"block-08cbbe48-01d7-45ee-9db3-fd30afba13fc"}},{"insert":"\n","attributes":{"table-col":{"width":"150"}}},{"insert":"1-1"},{"insert":"\n","attributes":{"block-id":"block-7823b3c5-1853-4dd0-a8fd-e0a1874144c8","list":{"rowspan":"1","colspan":"1","row":"row-vb5qk8","cell":"cell-0os8k3","list":"ordered"},"rowspan":"1","colspan":"1","row":"row-vb5qk8","cell":"cell-0os8k3"}},{"insert":"1-2"},{"insert":"\n","attributes":{"block-id":"block-0d680311-847f-4b11-aafe-a9ff2cc5af00","list":{"rowspan":"1","colspan":"1","row":"row-vb5qk8","cell":"cell-0os8k3","list":"ordered"},"rowspan":"1","colspan":"1","row":"row-vb5qk8","cell":"cell-0os8k3"}},{"insert":"2-1"},{"insert":"\n","attributes":{"block-id":"block-83196f95-b14e-46e6-9e9e-b71a6437a8c0","list":{"rowspan":"1","colspan":"1","row":"row-vb5qk8","cell":"cell-ya2p44","list":"ordered"},"rowspan":"1","colspan":"1","row":"row-vb5qk8","cell":"cell-ya2p44"}},{"insert":"2-2"},{"insert":"\n","attributes":{"block-id":"block-edeb24b5-ab2b-4ee7-884f-373af5015a96","list":{"rowspan":"1","colspan":"1","row":"row-vb5qk8","cell":"cell-ya2p44","list":"ordered"},"rowspan":"1","colspan":"1","row":"row-vb5qk8","cell":"cell-ya2p44"}},{"insert":"\n","attributes":{"block-id":"block-bef14b1b-e2fb-4ff9-9150-47f699f3445b","table-cell-line":{"rowspan":"1","colspan":"1","row":"row-vb5qk8","cell":"cell-h7t2at"},"row":"row-vb5qk8","cell":"cell-h7t2at","rowspan":"1","colspan":"1"}},{"insert":"\n","attributes":{"block-id":"block-c8dce1f5-1c63-4d63-a707-c200fe07b6de"}}] };
var tableWithContinousLists = { "ops": [
  {"insert":"\n","attributes":{"block-id":"block-16a15c79-7b28-41b0-8f1f-4e1456d8fa5f"}},
  {"insert":"\n\n\n","attributes":{"table-col":{"width":"150"}}},
  {"insert":"1-1"},
  {"insert":"\n","attributes":{"block-id":"block-e44de31b-186b-49f7-84b6-ccc94af9dca8","list":{"rowspan":"1","colspan":"1","row":"row-xeacfr","cell":"cell-y8f2f2","list":"ordered"},"rowspan":"1","colspan":"1","row":"row-xeacfr","cell":"cell-y8f2f2"}},
  {"insert":"111"},
  {"insert":"\n","attributes":{"block-id":"block-f422a442-26ee-460b-850b-ffc158f0b227","table-cell-line":{"rowspan":"1","colspan":"1","row":"row-xeacfr","cell":"cell-y8f2f2"},"row":"row-xeacfr","cell":"cell-y8f2f2","rowspan":"1","colspan":"1"}},
  {"insert":"1-2"},
  {"insert":"\n","attributes":{"block-id":"block-815136b8-234b-4e38-9eb3-4424bfe8429c","list":{"rowspan":"1","colspan":"1","row":"row-xeacfr","cell":"cell-y8f2f2","list":"ordered","counters":"{\"0\":1,\"1\":0,\"2\":0,\"3\":0,\"4\":0,\"5\":0,\"6\":0,\"7\":0,\"8\":0}"},"rowspan":"1","colspan":"1","row":"row-xeacfr","cell":"cell-y8f2f2"}},
  {"insert":"1-2-1"},{"insert":"\n","attributes":{"block-id":"block-7fe520e8-d94a-449a-8b8e-966c1c562a52","indent":1,"list":{"rowspan":"1","colspan":"1","row":"row-xeacfr","cell":"cell-y8f2f2","list":"ordered","counters":"{\"0\":1,\"1\":0,\"2\":0,\"3\":0,\"4\":0,\"5\":0,\"6\":0,\"7\":0,\"8\":0}"},"rowspan":"1","colspan":"1","row":"row-xeacfr","cell":"cell-y8f2f2"}},
  {"insert":"2-1"},{"insert":"\n","attributes":{"block-id":"block-a4975a54-2184-4c01-9730-6c806a0642e4","list":{"rowspan":"1","colspan":"1","row":"row-xeacfr","cell":"cell-wiee01","list":"ordered"},"rowspan":"1","colspan":"1","row":"row-xeacfr","cell":"cell-wiee01"}},
  {"insert":"2-2"},
  {"insert":"\n","attributes":{"block-id":"block-6bd27823-752a-4511-96c2-21baca239ab0","list":{"rowspan":"1","colspan":"1","row":"row-xeacfr","cell":"cell-wiee01","list":"ordered"},"rowspan":"1","colspan":"1","row":"row-xeacfr","cell":"cell-wiee01"}},
  {"insert":"2-2-1"},
  {"insert":"\n","attributes":{"block-id":"block-cd49a3ca-a4a2-4ff0-801a-ab700586a10a","indent":1,"list":{"rowspan":"1","colspan":"1","row":"row-xeacfr","cell":"cell-wiee01","list":"ordered"},"rowspan":"1","colspan":"1","row":"row-xeacfr","cell":"cell-wiee01"}},
  {"insert":"222"},{"insert":"\n","attributes":{"block-id":"block-6be5a9fe-32f9-43e2-b5e4-7d53badd3fcb","table-cell-line":{"rowspan":"1","colspan":"1","row":"row-xeacfr","cell":"cell-wiee01"},"row":"row-xeacfr","cell":"cell-wiee01","rowspan":"1","colspan":"1"}},
  {"insert":"2-2-2"},{"insert":"\n","attributes":{"block-id":"block-b29f8e0a-cf5b-483a-bec4-303dc9e7cab0","indent":1,"list":{"rowspan":"1","colspan":"1","row":"row-xeacfr","cell":"cell-wiee01","list":"ordered","counters":"{\"0\":2,\"1\":1,\"2\":0,\"3\":0,\"4\":0,\"5\":0,\"6\":0,\"7\":0,\"8\":0}"},"rowspan":"1","colspan":"1","row":"row-xeacfr","cell":"cell-wiee01"}},
  {"insert":"2-3"},{"insert":"\n","attributes":{"block-id":"block-17630f6b-7ebb-40a6-85ed-e1afb6a94db7","list":{"rowspan":"1","colspan":"1","row":"row-xeacfr","cell":"cell-wiee01","list":"ordered","counters":"{\"0\":2,\"1\":1,\"2\":0,\"3\":0,\"4\":0,\"5\":0,\"6\":0,\"7\":0,\"8\":0}"},"rowspan":"1","colspan":"1","row":"row-xeacfr","cell":"cell-wiee01"}},
  {"insert":"\n","attributes":{"block-id":"block-781f6061-4664-4a96-a0b7-cd97dd7da319","table-cell-line":{"rowspan":"1","colspan":"1","row":"row-xeacfr","cell":"cell-p0mtet"},"row":"row-xeacfr","cell":"cell-p0mtet","rowspan":"1","colspan":"1"}},
  {"insert":"\n","attributes":{"block-id":"block-2295c3b0-1e10-4bdc-92f1-052f798a4771"}}]
};
var tableWithBackgroundColors = {
  "ops":[
    {"insert":"\n","attributes":{"block-id":"block-eac47f22-5fdb-4c0f-a4e3-71212170e5f8"}},
    {"insert":"\n","attributes":{"table-col":{"width":"150"}}},
    {"insert":"\n","attributes":{"table-col":{"width":"150"}}},
    {"insert":"\n","attributes":{"table-col":{"width":"150"}}},
    {"insert":"1-1"},
    {"insert":"\n","attributes":{"block-id":"block-0d565e3b-c9e6-4910-b8c2-2cb6d101a7da","table-col-color":"red","table-cell-line":{"rowspan":"1","colspan":"1","row":"row-wmks3q","cell":"cell-my466o"},"row":"row-wmks3q","cell":"cell-my466o","rowspan":"1","colspan":"1"}},
    {"insert":"1-2"},
    {"insert":"\n","attributes":{"block-id":"block-94dc0088-cb48-47d5-9489-bdb91b5b88a0","table-cell-color":"green","table-cell-line":{"rowspan":"1","colspan":"1","row":"row-wmks3q","cell":"cell-beqlt4"},"row":"row-wmks3q","cell":"cell-beqlt4","rowspan":"1","colspan":"1"}},
    {"insert":"1-3"},
    {"insert":"\n","attributes":{"block-id":"block-5c2a16d7-e78d-4af3-80d2-79d1a2f033d6","table-cell-color":"green","table-cell-line":{"rowspan":"1","colspan":"1","row":"row-wmks3q","cell":"cell-bhzfgk"},"row":"row-wmks3q","cell":"cell-bhzfgk","rowspan":"1","colspan":"1"}},
    {"insert":"2-1"},
    {"insert":"\n","attributes":{"block-id":"block-80f6f76b-c6fe-4002-8365-ed8b8644e611","table-col-color":"red","table-row-color":"purple","table-cell-color":"yellow","table-cell-line":{"rowspan":"1","colspan":"1","row":"row-s3jnk7","cell":"cell-p674n7"},"row":"row-s3jnk7","cell":"cell-p674n7","rowspan":"1","colspan":"1"}},
    {"insert":"2-2"},
    {"insert":"\n","attributes":{"block-id":"block-3377ac5a-3982-4c7a-9e1f-07bc4a6f1f12","table-row-color":"purple","table-cell-line":{"rowspan":"1","colspan":"1","row":"row-s3jnk7","cell":"cell-9yonxt"},"row":"row-s3jnk7","cell":"cell-9yonxt","rowspan":"1","colspan":"1"}},
    {"insert":"2-3"},
    {"insert":"\n","attributes":{"block-id":"block-a4af879f-3cef-464f-80d4-d59ff0f8687a","table-row-color":"purple","table-cell-line":{"rowspan":"1","colspan":"1","row":"row-s3jnk7","cell":"cell-l1lsw0"},"row":"row-s3jnk7","cell":"cell-l1lsw0","rowspan":"1","colspan":"1"}},
    {"insert":"3-1"},
    {"insert":"\n","attributes":{"block-id":"block-1e0f2858-a608-44ae-b8ac-c2cd5846689b","table-col-color":"red","table-cell-line":{"rowspan":"1","colspan":"1","row":"row-3s1mf2","cell":"cell-nqjt5g"},"row":"row-3s1mf2","cell":"cell-nqjt5g","rowspan":"1","colspan":"1"}},
    {"insert":"3-2"},
    {"insert":"\n","attributes":{"block-id":"block-c3729791-e81c-47c7-867b-07a1bfaf91b9","table-cell-line":{"rowspan":"1","colspan":"1","row":"row-3s1mf2","cell":"cell-8xcpfv"},"row":"row-3s1mf2","cell":"cell-8xcpfv","rowspan":"1","colspan":"1"}},
    {"insert":"3-3"},
    {"insert":"\n","attributes":{"block-id":"block-6c654bea-a877-451c-a44e-e5300fbbae06","table-cell-line":{"rowspan":"1","colspan":"1","row":"row-3s1mf2","cell":"cell-01q81m"},"row":"row-3s1mf2","cell":"cell-01q81m","rowspan":"1","colspan":"1"}},
    {"insert":"\n","attributes":{"block-id":"block-76992c14-79e3-4846-be6a-93b5be5d1d20"}}
  ]
};


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
  },
  customTableCellAttrs: (g) => {
    const attrs = [];
    ['table-col-color', 'table-row-color', 'table-cell-color'].forEach(key => {
      if (g.attrs && g.attrs[key]) {
        attrs.push({
          key: `data-${key}`,
          value: g.attrs[key]
        });
      }
    });
    return attrs;
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
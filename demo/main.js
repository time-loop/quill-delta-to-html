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
var tableWithLists = { "ops": [
  {"insert":"\n","attributes":{"block-id":"block-08cbbe48-01d7-45ee-9db3-fd30afba13fc"}},
  {"insert":"\n\n\n","attributes":{"table-col":{"width":"150"}}},
  {"insert":"1-1"},
  {"insert":"\n","attributes":{"block-id":"block-7823b3c5-1853-4dd0-a8fd-e0a1874144c8","list":{"rowspan":"1","colspan":"1","row":"row-vb5qk8","cell":"cell-0os8k3","list":"ordered"},"rowspan":"1","colspan":"1","row":"row-vb5qk8","cell":"cell-0os8k3"}},
  {"insert":"1-2"},
  {"insert":"\n","attributes":{"block-id":"block-0d680311-847f-4b11-aafe-a9ff2cc5af00","list":{"rowspan":"1","colspan":"1","row":"row-vb5qk8","cell":"cell-0os8k3","list":"ordered"},"rowspan":"1","colspan":"1","row":"row-vb5qk8","cell":"cell-0os8k3"}},
  {"insert":"2-1"},
  {"insert":"\n","attributes":{"block-id":"block-83196f95-b14e-46e6-9e9e-b71a6437a8c0","list":{"rowspan":"1","colspan":"1","row":"row-vb5qk8","cell":"cell-ya2p44","list":"ordered"},"rowspan":"1","colspan":"1","row":"row-vb5qk8","cell":"cell-ya2p44"}},
  {"insert":"2-2"},
  {"insert":"\n","attributes":{"block-id":"block-edeb24b5-ab2b-4ee7-884f-373af5015a96","list":{"rowspan":"1","colspan":"1","row":"row-vb5qk8","cell":"cell-ya2p44","list":"ordered"},"rowspan":"1","colspan":"1","row":"row-vb5qk8","cell":"cell-ya2p44"}},
  {"insert":"\n","attributes":{"block-id":"block-bef14b1b-e2fb-4ff9-9150-47f699f3445b","table-cell-line":{"rowspan":"1","colspan":"1","row":"row-vb5qk8","cell":"cell-h7t2at"},"row":"row-vb5qk8","cell":"cell-h7t2at","rowspan":"1","colspan":"1"}},
  {"insert":"\n","attributes":{"block-id":"block-c8dce1f5-1c63-4d63-a707-c200fe07b6de"}}
]};
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
var refacteredTable = {"ops":[{"insert":"\n\n\n","attributes":{"table-col":{"width":"150"}}},{"insert":"1"},{"insert":"\n","attributes":{"block-id":"block-8a520f4c-8b86-4f90-8601-c3fe33fc613f","table-cell-line":{"rowspan":"1","colspan":"1","row":"row-k7pj4f","cell":"cell-jq4iqq"}}},{"insert":"2"},{"insert":"\n","attributes":{"block-id":"block-2784b69e-70e3-4686-8151-1775124f093b","table-cell-line":{"rowspan":"1","colspan":"1","row":"row-k7pj4f","cell":"cell-fz7ypf"}}},{"insert":"3"},{"insert":"\n","attributes":{"block-id":"block-70629fb1-5e68-4b8f-8c18-675152a214af","table-cell-line":{"rowspan":"1","colspan":"1","row":"row-k7pj4f","cell":"cell-x3gmes"}}},{"insert":"4"},{"insert":"\n","attributes":{"block-id":"block-f4ef771e-f80f-4c9d-b285-cf1361e0ecb0","table-cell-line":{"rowspan":"1","colspan":"1","row":"row-co0txk","cell":"cell-0btmtl"}}},{"insert":"5"},{"insert":"\n","attributes":{"block-id":"block-d804f18e-fba9-4449-9d37-d58ac65a2f9c","table-cell-line":{"rowspan":"1","colspan":"1","row":"row-co0txk","cell":"cell-0rtf4t"}}},{"insert":"6"},{"insert":"\n","attributes":{"block-id":"block-1314b3fb-c3ef-47f8-a021-34f58169939f","table-cell-line":{"rowspan":"1","colspan":"1","row":"row-co0txk","cell":"cell-qpwmsg"}}},{"insert":"6-1"},{"insert":"\n","attributes":{"block-id":"block-e17be4cf-7533-4c88-9ae1-02ee13240c0d","list":{"rowspan":"1","colspan":"1","row":"row-co0txk","cell":"cell-qpwmsg","list":"bullet"}}},{"insert":"6-2"},{"insert":"\n","attributes":{"block-id":"block-bca0e461-5132-4a64-a258-9f315d3165d4","list":{"rowspan":"1","colspan":"1","row":"row-co0txk","cell":"cell-qpwmsg","list":"bullet"}}},{"insert":"7"},{"insert":"\n","attributes":{"block-id":"block-f3a435c2-a5bb-4922-93e0-6f7887bf7a28","table-cell-line":{"rowspan":"1","colspan":"1","row":"row-93ejde","cell":"cell-t1ymr0"}}},{"insert":"8"},{"insert":"\n","attributes":{"block-id":"block-95c858cf-6124-46cd-9427-a49051b1c6d7","table-cell-line":{"rowspan":"1","colspan":"1","row":"row-93ejde","cell":"cell-yvmsvy"}}},{"insert":"9"},{"insert":"\n","attributes":{"block-id":"block-eed098b8-f372-4827-8be6-91f69ad3f9f3","table-cell-line":{"rowspan":"1","colspan":"1","row":"row-93ejde","cell":"cell-7cs0fo"}}},{"insert":"\n","attributes":{"block-id":"block-2b4dd068-bd01-47be-b496-6dd4c7c9f743"}}]};
var advancedBanner = {"ops":[{"insert":"line"},{"insert":"\n","attributes":{"block-id":"block-faab0848-14d2-41a0-97a2-1822060db1b7","advanced-banner":"8d02afca-577f-4f8f-87f5-ae2efb8d8772","advanced-banner-color":"green"}},{"insert":"list"},{"insert":"\n","attributes":{"block-id":"block-8d32ae83-ddd3-486e-81e3-b5bb77439f67","advanced-banner":"8d02afca-577f-4f8f-87f5-ae2efb8d8772","advanced-banner-color":"green","list":{"list":"ordered"}}},{"insert":"list"},{"insert":"\n","attributes":{"block-id":"block-c66fda81-0cb5-4ac2-82e8-d764935dee52","advanced-banner":"8d02afca-577f-4f8f-87f5-ae2efb8d8772","advanced-banner-color":"green","list":{"list":"ordered"}}},{"insert":"list"},{"insert":"\n","attributes":{"block-id":"block-00344019-f361-4187-a0c8-e3d5ce20f55b","advanced-banner":"8d02afca-577f-4f8f-87f5-ae2efb8d8772","advanced-banner-color":"green","indent":1,"list":{"list":"ordered"}}},{"insert":"quote"},{"insert":"\n","attributes":{"block-id":"block-fe1b133a-60ff-4b31-9f92-be934e75fe58","advanced-banner":"8d02afca-577f-4f8f-87f5-ae2efb8d8772","advanced-banner-color":"green","blockquote":{"in-list":"ordered","wrapper-indent":"1"}}},{"insert":"list"},{"insert":"\n","attributes":{"block-id":"block-0bc5ca7e-5dd6-4ad0-8a3e-a3a8fe781f27","advanced-banner":"8d02afca-577f-4f8f-87f5-ae2efb8d8772","advanced-banner-color":"green","indent":1,"list":{"list":"ordered"}}},{"insert":"list"},{"insert":"\n","attributes":{"block-id":"block-5871f5f9-dc83-4ca5-8187-62bb784fbd91","advanced-banner":"8d02afca-577f-4f8f-87f5-ae2efb8d8772","advanced-banner-color":"green","list":{"list":"ordered"}}},{"insert":"line"},{"insert":"\n","attributes":{"block-id":"block-20f94eea-dac6-4548-a97b-3a5e2adc8333","advanced-banner":"8d02afca-577f-4f8f-87f5-ae2efb8d8772","advanced-banner-color":"green"}}]}

var linesInColumns = {"ops":[{"insert":"\n","attributes":{"block-id":"block-0911511d-ff60-46f1-8db5-8d95f64a7e1f"}},{"insert":"\n","attributes":{"block-id":"block-c391ac7c-26cb-4bad-a8d1-856a3835681f"}},{"insert":"123"},{"insert":"\n","attributes":{"layout":"ce521967-3bed-45c5-bacb-a6755d4ce96c_79fffcca-924f-40c5-b06c-7a07075a22c2","layout-width":"0.5","block-id":"block-989dceca-259c-4b89-bfcf-c563f1ef3059"}},{"insert":"456"},{"insert":"\n","attributes":{"layout":"ce521967-3bed-45c5-bacb-a6755d4ce96c_79fffcca-924f-40c5-b06c-7a07075a22c2","layout-width":"0.5","block-id":"block-5f91e117-7bf6-4e1a-875d-01fde040d4f3"}},{"insert":"123"},{"insert":"\n","attributes":{"layout":"ce521967-3bed-45c5-bacb-a6755d4ce96c_036deb86-dc4b-447a-a353-50d3c3cf3475","layout-width":"0.5","block-id":"block-13750496-bab2-4f06-8c94-cdc3a04d5790"}},{"insert":"456"},{"insert":"\n","attributes":{"layout":"ce521967-3bed-45c5-bacb-a6755d4ce96c_036deb86-dc4b-447a-a353-50d3c3cf3475","layout-width":"0.5","block-id":"block-3d4fb0de-0ab6-463a-8f56-46405ece6a98"}},{"insert":"\n","attributes":{"block-id":"block-6c2d4b21-7ec6-4d03-b18f-43d35f94ba14"}}]}

var linesInAdvancedBanner = {"ops":[{"insert":"123"},{"insert":"\n","attributes":{"block-id":"block-35f61b7e-585d-4fdd-923f-8469a34ec51d","advanced-banner":"2a8a7f3f-5a3e-4e33-af20-854920c32f5d","advanced-banner-color":"green"}},{"insert":"456"},{"insert":"\n","attributes":{"block-id":"block-01aa9489-cce7-4e2a-867b-bb7f14e504b3","advanced-banner":"2a8a7f3f-5a3e-4e33-af20-854920c32f5d","advanced-banner-color":"green"}}]};

var advancedBannerInList = {"ops":[{"insert":"list item"},{"insert":"\n","attributes":{"block-id":"block-98b186a1-1b18-4b05-b974-68e5332a3477","list":{"list":"bullet"}}},{"insert":"quote 1"},{"insert":"\n","attributes":{"block-id":"block-752a94cf-fce9-4381-a8fe-0fa7a990e8f5","blockquote":{"in-list":"bullet","wrapper-indent":"1"}}},{"insert":"quote 2"},{"insert":"\n","attributes":{"block-id":"block-0a9155bd-b073-4226-a1e0-3dc0be346d95","blockquote":{"in-list":"bullet","wrapper-indent":"1"}}},{"insert":"list item"},{"insert":"\n","attributes":{"block-id":"block-8395f98d-1a0a-471b-9695-e004c463ef76","indent":1,"list":{"list":"bullet"}}},{"insert":"list item"},{"insert":"\n","attributes":{"block-id":"block-f1cfbf6e-0f6d-4f1b-bca5-2cb4a74d107b","indent":3,"list":{"list":"bullet"}}},{"insert":"list in advanced banner 1"},{"insert":"\n","attributes":{"block-id":"block-073d0400-6d89-46ae-9c00-3aea05c0d79b","advanced-banner":"eec704d4-26d7-482a-aeaa-4e72059e7bc1","advanced-banner-in-list":"bullet","advanced-banner-list-indent":"1","advanced-banner-color":"green","list":{"list":"ordered"}}},{"insert":"advanced banner"},{"insert":"\n","attributes":{"block-id":"block-4713084a-c2f2-4aa4-b611-2431387e6f17","advanced-banner":"eec704d4-26d7-482a-aeaa-4e72059e7bc1","advanced-banner-in-list":"bullet","advanced-banner-list-indent":"1","advanced-banner-color":"green"}},{"insert":"list in advanced banner 1"},{"insert":"\n","attributes":{"block-id":"block-073d0400-6d89-46ae-9c00-3aea05c0d79b","advanced-banner":"eec704d4-26d7-482a-aeaa-4e72059e7bc1","advanced-banner-in-list":"bullet","advanced-banner-list-indent":"1","advanced-banner-color":"green","list":{"list":"ordered"}}},{"insert":"list in advanced banner 2"},{"insert":"\n","attributes":{"block-id":"block-5fdd71d1-aec6-4106-89bc-e5bd5739011b","advanced-banner":"eec704d4-26d7-482a-aeaa-4e72059e7bc1","advanced-banner-in-list":"bullet","advanced-banner-list-indent":"1","advanced-banner-color":"green","list":{"list":"ordered"}}},{"insert":"list item"},{"insert":"\n","attributes":{"block-id":"block-312064b7-1f62-4c3f-aa8e-7432dad257d0","indent":1,"list":{"list":"bullet"}}},{"insert":"list item"},{"insert":"\n","attributes":{"block-id":"block-7780acf6-e2f8-4ae1-a2e1-0fe9637d37f9","list":{"list":"bullet"}}},{"insert":"Plain text"},{"insert":"\n","attributes":{"block-id":"block-8c3cec0f-dd36-438f-aae7-e904b664784f"}}]};
var testAdvancedBannerInListAndNotInList = {"ops":[{"insert":"list item"},{"insert":"\n","attributes":{"block-id":"block-98b186a1-1b18-4b05-b974-68e5332a3477","list":{"list":"bullet"}}},{"insert":"quote 1"},{"insert":"\n","attributes":{"block-id":"block-752a94cf-fce9-4381-a8fe-0fa7a990e8f5","blockquote":{"in-list":"bullet","wrapper-indent":"1"}}},{"insert":"quote 2"},{"insert":"\n","attributes":{"block-id":"block-0a9155bd-b073-4226-a1e0-3dc0be346d95","blockquote":{"in-list":"bullet","wrapper-indent":"1"}}},{"insert":"list item"},{"insert":"\n","attributes":{"block-id":"block-8395f98d-1a0a-471b-9695-e004c463ef76","indent":1,"list":{"list":"bullet"}}},{"insert":"list item"},{"insert":"\n","attributes":{"block-id":"block-f1cfbf6e-0f6d-4f1b-bca5-2cb4a74d107b","indent":3,"list":{"list":"bullet"}}},{"insert":"advanced banner"},{"insert":"\n","attributes":{"block-id":"block-4713084a-c2f2-4aa4-b611-2431387e6f17","advanced-banner":"eec704d4-26d7-482a-aeaa-4e72059e7bc1","advanced-banner-in-list":"bullet","advanced-banner-list-indent":"1","advanced-banner-color":"green"}},{"insert":"list in advanced banner 1"},{"insert":"\n","attributes":{"block-id":"block-073d0400-6d89-46ae-9c00-3aea05c0d79b","advanced-banner":"eec704d4-26d7-482a-aeaa-4e72059e7bc1","advanced-banner-in-list":"bullet","advanced-banner-list-indent":"1","advanced-banner-color":"green","list":{"list":"ordered"}}},{"insert":"list in advanced banner 2"},{"insert":"\n","attributes":{"block-id":"block-5fdd71d1-aec6-4106-89bc-e5bd5739011b","advanced-banner":"eec704d4-26d7-482a-aeaa-4e72059e7bc1","advanced-banner-in-list":"bullet","advanced-banner-list-indent":"1","advanced-banner-color":"green","list":{"list":"ordered"}}},{"insert":"list item"},{"insert":"\n","attributes":{"block-id":"block-312064b7-1f62-4c3f-aa8e-7432dad257d0","indent":1,"list":{"list":"bullet"}}},{"insert":"list item"},{"insert":"\n","attributes":{"block-id":"block-7780acf6-e2f8-4ae1-a2e1-0fe9637d37f9","list":{"list":"bullet"}}},{"insert":"Plain text"},{"insert":"\n","attributes":{"block-id":"block-8c3cec0f-dd36-438f-aae7-e904b664784f"}},{"insert":"\n","attributes":{"block-id":"block-893d67a8-0d95-491a-b14a-a06478160b28"}},{"insert":"sdfsdfsf"},{"insert":"\n","attributes":{"block-id":"block-5581e95c-7c9a-488a-9bd9-0ab51b6c61b2","list":{"list":"ordered"}}},{"insert":"sdfsdfsdfsdf"},{"insert":"\n","attributes":{"block-id":"block-91111915-7dba-4d4b-a960-4f23e7613e9c","list":{"list":"ordered"}}},{"insert":"\n","attributes":{"block-id":"block-b723718e-672c-42ec-9f05-f44ca346d293"}},{"insert":"sdfdsfsdfdsfdsf"},{"insert":"\n","attributes":{"block-id":"block-6b119d03-2c8b-4f7c-9f73-68cf69b9b84d","advanced-banner":"613d979d-7f6a-494e-a734-6b85e4188447","advanced-banner-color":"blue","list":{"list":"ordered"}}},{"insert":"dsfdsfdsfdsfsdfdsfdsf"},{"insert":"\n","attributes":{"block-id":"block-6901168a-418d-4e21-a33b-af65b5a53779","advanced-banner":"613d979d-7f6a-494e-a734-6b85e4188447","advanced-banner-color":"blue","indent":1,"list":{"list":"ordered"}}},{"insert":"dsfdsfsdfdsfsdf"},{"insert":"\n","attributes":{"block-id":"block-2883806e-7819-4da8-a6e3-768659c1bd4f","advanced-banner":"613d979d-7f6a-494e-a734-6b85e4188447","advanced-banner-color":"blue","list":{"list":"ordered"}}},{"insert":"sdfdsfdsfdsfdsfdsfdsfsdf"},{"insert":"\n","attributes":{"block-id":"block-6ae37335-26a0-4f0c-aa81-0a71bcf0f31b","advanced-banner":"613d979d-7f6a-494e-a734-6b85e4188447","advanced-banner-color":"blue","list":{"list":"ordered"}}},{"insert":"sdfsdfsdfdsfsdf"},{"insert":"\n","attributes":{"block-id":"block-4d71a7ba-9de6-404a-81d9-9f9dcc9a782f","advanced-banner":"613d979d-7f6a-494e-a734-6b85e4188447","advanced-banner-color":"blue","list":{"list":"ordered"}}}]};
var testAdvancedBannerInList = { "ops": [
  {"insert":"hello this is a list.","attributes":{}},
  {"insert":"\n","attributes":{"list":{"list":"ordered"},"block-id":"block-13537b63-bad0-4f8a-9240-29ff62893f46"}},
  {"insert":"hello this is a banner in list","attributes":{}},
  {"insert":"\n","attributes":{"block-id":"block-d228afcf-4924-4b42-a30d-4cec06dc91bb","advanced-banner":"fb9a99dc-105a-4187-92f4-ee1cfea88d77","advanced-banner-color":"red","advanced-banner-in-list":"ordered","advanced-banner-list-indent":"1"}},
  {"insert":"list in banner in list","attributes":{}},
  {"insert":"\n","attributes":{"list":{"list":"bullet"},"block-id":"block-58eddce1-afb3-4435-a6ca-9e5bda7649d6","advanced-banner":"fb9a99dc-105a-4187-92f4-ee1cfea88d77","advanced-banner-color":"red","advanced-banner-in-list":"ordered","advanced-banner-list-indent":"1"}},
  {"insert":"sdfsfsdf","attributes":{}},
  {"insert":"\n","attributes":{"list":{"list":"bullet"},"block-id":"block-cb76b60c-0add-4d54-9b52-3cb86c65a2cc","advanced-banner":"fb9a99dc-105a-4187-92f4-ee1cfea88d77","advanced-banner-color":"red","advanced-banner-in-list":"ordered","advanced-banner-list-indent":"1"}},
  {"insert":{"bookmark":{"url":"https://medium.com/","title":null,"favicon":null,"service":"custom","updated":null,"thumbnail":null,"description":null}},"attributes":{"bookmark":{"in-list":"bullet"},"layout":null,"layout-align":null,"layout-width":null,"advanced-banner":"fb9a99dc-105a-4187-92f4-ee1cfea88d77","advanced-banner-icon":null,"advanced-banner-color":"red","advanced-banner-in-list":"ordered","advanced-banner-list-indent":"1", renderAsBlock: true}},
  {"insert":"sdfdsf","attributes":{}},
  {"insert":"\n","attributes":{"list":{"list":"bullet"},"block-id":"block-cb76b60c-0add-4d54-9b52-3cb86c65a2cc","advanced-banner":"fb9a99dc-105a-4187-92f4-ee1cfea88d77","advanced-banner-color":"red","advanced-banner-in-list":"ordered","advanced-banner-list-indent":"1"}},
  {"insert":"yeah.","attributes":{}},
  {"insert":"\n","attributes":{"list":{"list":"bullet"},"block-id":"block-6728395d-9fe4-4bf5-a331-b0357199040f","advanced-banner":"fb9a99dc-105a-4187-92f4-ee1cfea88d77","advanced-banner-color":"red","advanced-banner-in-list":"ordered","advanced-banner-list-indent":"1"}},
  {"insert":{"bookmark":{"url":"https://medium.com/","title":null,"favicon":null,"service":"custom","updated":null,"thumbnail":null,"description":null}},"attributes":{"bookmark":{},"layout":null,"layout-align":null,"layout-width":null,"advanced-banner":"fb9a99dc-105a-4187-92f4-ee1cfea88d77","advanced-banner-icon":null,"advanced-banner-color":"red","advanced-banner-in-list":"ordered","advanced-banner-list-indent":"1", renderAsBlock: true}},
  {"insert":"\n","attributes":{"block-id":"block-131d392d-0f23-4fd7-8d0e-a5e97c0a44ba","advanced-banner":"fb9a99dc-105a-4187-92f4-ee1cfea88d77","advanced-banner-color":"red","advanced-banner-in-list":"ordered","advanced-banner-list-indent":"1"}},
  {"insert":"sdfkljsdjflkdsjfdsf","attributes":{}},
  {"insert":"\n","attributes":{"list":{"list":"ordered"},"block-id":"block-cd4402a7-fcd3-4b72-9a19-14ec7486a648"}},
  {"insert":"sdfsdfsdfsdf","attributes":{}},{"insert":"\n","attributes":{"list":{"list":"ordered"},"block-id":"block-3ab4a5fb-ac41-4dc7-8da9-1fd6fff27494"}},
  {"insert":"list in banner .","attributes":{}},{"insert":"\n","attributes":{"list":{"list":"ordered"},"block-id":"block-df4602f1-b4fc-4919-bae8-609324767798","advanced-banner":"b6c2105f-89c4-4887-9870-4f5233261c94","advanced-banner-color":"blue"}},
  {"insert":"list in banner","attributes":{}},{"insert":"\n","attributes":{"list":{"list":"ordered"},"block-id":"block-7ecdf3c5-dcb2-4402-8c75-66061a6459d9","advanced-banner":"b6c2105f-89c4-4887-9870-4f5233261c94","advanced-banner-color":"blue"}},
  {"insert":"sdffsfdsf","attributes":{}},
  {"insert":"\n","attributes":{"list":{"list":"ordered"},"indent":1,"block-id":"block-68be69c9-29ef-4352-ad09-abcf2a8e792c","advanced-banner":"b6c2105f-89c4-4887-9870-4f5233261c94","advanced-banner-color":"blue"}},
  {"insert":{"bookmark":{"url":"https://medium.com/","title":null,"favicon":null,"service":"custom","updated":null,"thumbnail":null,"description":null}},"attributes":{"bookmark":{"in-list":"ordered","wrapper-indent":"1"},"layout":null,"layout-align":null,"layout-width":null,"advanced-banner":"b6c2105f-89c4-4887-9870-4f5233261c94","advanced-banner-icon":null,"advanced-banner-color":"blue","advanced-banner-in-list":null,"advanced-banner-list-indent":null, renderAsBlock: true}},
  {"insert":"list in banner.","attributes":{}},{"insert":"\n","attributes":{"list":{"list":"ordered"},"indent":1,"block-id":"block-7993bf4b-3279-4f54-9c5e-98678a577a70","advanced-banner":"b6c2105f-89c4-4887-9870-4f5233261c94","advanced-banner-color":"blue"}},
  {"insert":"\n","attributes":{"block-id":"block-2922ac17-3b23-462d-a317-f9b82e8fb23b"}}]
};
var codeBlocksInList = {
  "op": [
    {"insert":"hello this is a list.","attributes":{}},
    {"insert":"\n","attributes":{"list":{"list":"bullet"}}},
    {"insert":"code block","attributes":{}},
    {"attributes":{"code-block":{"code-block":"javascript", "in-list":"bullet"}},"insert":"\n"}
  ]
};


var qdc = new QuillDeltaToHtmlConverter(codeBlocksInList.ops, {
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
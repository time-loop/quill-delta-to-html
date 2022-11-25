import * as assert from 'assert';

import { Grouper } from './../../src/grouper/Grouper';
import { ListNester } from './../../src/grouper/ListNester';
import { DeltaInsertOp } from './../../src/DeltaInsertOp';
import {
  ListGroup,
  ListItem,
  InlineGroup,
  BlockGroup,
  BlotBlock,
} from './../../src/grouper/group-types';
import { ListType } from './../../src/value-types';
import { InsertDataCustom } from '../../src/InsertData';

describe('ListNester', function () {
  describe('nest()', function () {
    // clickup need nest different types of lists, so remove this test case.
    // it('should not nest different types of lists', function () {
    //   var ops = [
    //     new DeltaInsertOp('ordered list 1 item 1'),
    //     new DeltaInsertOp('\n', { list: { list: ListType.Ordered } }),
    //     new DeltaInsertOp('bullet list 1 item 1'),
    //     new DeltaInsertOp('\n', { list: { list: ListType.Bullet } }),
    //     new DeltaInsertOp('bullet list 1 item 2'),
    //     new DeltaInsertOp('\n', { list: { list: ListType.Bullet } }),
    //     new DeltaInsertOp('haha'),
    //     new DeltaInsertOp('\n'),
    //     new DeltaInsertOp('\n', { list: { list: ListType.Bullet } }),
    //     new DeltaInsertOp('\n', { list: { list: ListType.Checked } }),
    //     new DeltaInsertOp('\n', { list: { list: ListType.Unchecked } }),
    //   ];

    //   var groups = Grouper.pairOpsWithTheirBlock(ops);
    //   var nester = new ListNester();
    //   var act = nester.nest(groups);
    //   //console.log(JSON.stringify(act, null, 3));
    //   assert.deepEqual(act, [
    //     new ListGroup([new ListItem(<BlockGroup>groups[0])]),
    //     new ListGroup([
    //       new ListItem(<BlockGroup>groups[1]),
    //       new ListItem(<BlockGroup>groups[2]),
    //     ]),
    //     new InlineGroup([ops[6], ops[7]]),
    //     new ListGroup([new ListItem(new BlockGroup(ops[8], []))]),
    //     new ListGroup([
    //       new ListItem(new BlockGroup(ops[9], [])),
    //       new ListItem(new BlockGroup(ops[10], [])),
    //     ]),
    //   ]);
    // });
    it('should nest defined custom blotBlock', function () {
      var ops = [
        new DeltaInsertOp('\n', { list: { list: ListType.Ordered } }),
        new DeltaInsertOp(new InsertDataCustom('bookmark', {}), {
          bookmark: { 'in-list': 'ordered' },
          renderAsBlock: true,
        }),
        new DeltaInsertOp('\n', { list: { list: ListType.Bullet } }),
      ];

      var groups = Grouper.pairOpsWithTheirBlock(ops);
      var nester = new ListNester(['bookmark']);
      var act = nester.nest(groups);
      assert.deepEqual(act, [
        new ListGroup([
          new ListItem(<BlockGroup>groups[0]),
          new ListItem(<BlotBlock>groups[1]),
          new ListItem(<BlockGroup>groups[2]),
        ]),
      ]);
    });

    it('should nest different types of lists', function () {
      var ops = [
        new DeltaInsertOp('ordered list 1 item 1'),
        new DeltaInsertOp('\n', { list: { list: ListType.Ordered } }),
        new DeltaInsertOp('bullet list 1 item 1'),
        new DeltaInsertOp('\n', { list: { list: ListType.Bullet } }),
        new DeltaInsertOp('bullet list 1 item 2'),
        new DeltaInsertOp('\n', { list: { list: ListType.Bullet } }),
        new DeltaInsertOp('haha'),
        new DeltaInsertOp('\n'),
        new DeltaInsertOp('\n', { list: { list: ListType.Bullet } }),
        new DeltaInsertOp('\n', { list: { list: ListType.Checked } }),
        new DeltaInsertOp('\n', { list: { list: ListType.Unchecked } }),
      ];

      var groups = Grouper.pairOpsWithTheirBlock(ops);
      var nester = new ListNester();
      var act = nester.nest(groups);
      //console.log(JSON.stringify(act, null, 3));
      assert.deepEqual(act, [
        new ListGroup([
          new ListItem(<BlockGroup>groups[0]),
          new ListItem(<BlockGroup>groups[1]),
          new ListItem(<BlockGroup>groups[2]),
        ]),
        new InlineGroup([ops[6], ops[7]]),
        new ListGroup([
          new ListItem(new BlockGroup(ops[8], [])),
          new ListItem(new BlockGroup(ops[9], [])),
          new ListItem(new BlockGroup(ops[10], [])),
        ]),
      ]);
    });

    it('should nest if lists are same and later ones have higher indent', function () {
      var ops = [
        new DeltaInsertOp('item 1'),
        new DeltaInsertOp('\n', { list: { list: ListType.Ordered } }),
        new DeltaInsertOp('item 1a'),
        new DeltaInsertOp('\n', {
          list: { list: ListType.Ordered },
          indent: 1,
        }),
        new DeltaInsertOp('item 1a-i'),
        new DeltaInsertOp('\n', {
          list: { list: ListType.Ordered },
          indent: 3,
        }),
        new DeltaInsertOp('item 1b'),
        new DeltaInsertOp('\n', {
          list: { list: ListType.Ordered },
          indent: 1,
        }),
        new DeltaInsertOp('item 2'),
        new DeltaInsertOp('\n', { list: { list: ListType.Ordered } }),
        new DeltaInsertOp('haha'),
        new DeltaInsertOp('\n'),
        new DeltaInsertOp('\n', {
          list: { list: ListType.Ordered },
          indent: 5,
        }),
        new DeltaInsertOp('\n', { list: { list: ListType.Bullet }, indent: 4 }),
      ];
      var pairs = Grouper.pairOpsWithTheirBlock(ops);

      var nester = new ListNester();
      var act = nester.nest(pairs);
      //console.log(JSON.stringify( act, null, 4));

      var l1b = new ListItem(<BlockGroup>pairs[3]);
      var lai = new ListGroup([new ListItem(<BlockGroup>pairs[2])]);
      var l1a = new ListGroup([new ListItem(<BlockGroup>pairs[1], lai)]);

      var li1 = new ListGroup([new ListItem(<BlockGroup>pairs[0])]);
      li1.items[0].innerList = new ListGroup(l1a.items.concat(l1b));
      var li2 = new ListGroup([new ListItem(<BlockGroup>pairs[4])]);
      //console.log(JSON.stringify(act, null, 3));
      assert.deepEqual(act, [
        new ListGroup(li1.items.concat(li2.items)),

        new InlineGroup([ops[10], ops[11]]),
        new ListGroup([new ListItem(new BlockGroup(ops[12], []))]),
        new ListGroup([new ListItem(new BlockGroup(ops[13], []))]),
      ]);
    });
  });
});

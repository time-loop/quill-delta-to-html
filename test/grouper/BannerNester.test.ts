import * as assert from 'assert';

import { Grouper } from './../../src/grouper/Grouper';
import {
  BannerNester,
  BANNER_COLOR_ATTR_KEY,
  BANNER_ID_ATTR_KEY,
} from './../../src/grouper/BannerNester';
import { ListNester } from './../../src/grouper/ListNester';
import { DeltaInsertOp } from './../../src/DeltaInsertOp';
import {
  ListGroup,
  ListItem,
  BlockGroup,
  AdvancedBanner,
} from './../../src/grouper/group-types';
import { ListType } from './../../src/value-types';
import { InsertDataCustom } from '../../src/InsertData';

describe('ListNester', function () {
  describe('nest()', function () {
    it('should nest blocks in new banner', function () {
      var ops = [
        new DeltaInsertOp('line'),
        new DeltaInsertOp('\n', {
          [BANNER_ID_ATTR_KEY]: 'test-banner-id',
          [BANNER_COLOR_ATTR_KEY]: 'green',
        }),
        new DeltaInsertOp('list'),
        new DeltaInsertOp('\n', {
          list: { list: ListType.Ordered },
          [BANNER_ID_ATTR_KEY]: 'test-banner-id',
          [BANNER_COLOR_ATTR_KEY]: 'green',
        }),
        new DeltaInsertOp(new InsertDataCustom('bookmark', {}), {
          bookmark: {},
          renderAsBlock: true,
          [BANNER_ID_ATTR_KEY]: 'test-banner-id',
          [BANNER_COLOR_ATTR_KEY]: 'green',
        }),
      ];
      var groups = Grouper.pairOpsWithTheirBlock(ops);
      var bannerNester = new BannerNester();
      var listNester = new ListNester(['bookmark']);

      var act = bannerNester.nest(listNester.nest(groups));

      assert.deepEqual(act, [
        new AdvancedBanner(
          [
            groups[0],
            new ListGroup([new ListItem(<BlockGroup>groups[1])]),
            groups[2],
          ],
          'test-banner-id',
          'green',
          '',
          '',
          '',
          ''
        ),
      ]);
    });
  });
});

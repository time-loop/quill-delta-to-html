import {
  TDataGroup,
  BlockGroup,
  ListGroup,
  BlotBlock,
  AdvancedBanner,
} from './group-types';
import { groupConsecutiveElementsWhile } from '../helpers/array';

const BANNER_ID_ATTR_KEY = 'advanced-banner';
const BANNER_COLOR_ATTR_KEY = 'advanced-banner-color';
const BANNER_ICON_ATTR_KEY = 'advanced-banner-icon';

export class BannerNester {
  nest(groups: TDataGroup[]): TDataGroup[] {
    var bannerBlocked = this.convertBlocksToBanners(groups);
    return bannerBlocked;
  }

  private convertBlocksToBanners(items: TDataGroup[]): Array<TDataGroup> {
    var grouped = groupConsecutiveElementsWhile(
      items,
      (g: TDataGroup, gPrev: TDataGroup) => {
        const gBannerId = getBannerId(g);
        const gPrevBannerId = getBannerId(gPrev);
        return !!gBannerId && !!gPrevBannerId && gBannerId === gPrevBannerId;
      }
    );

    return grouped.map((item: TDataGroup | TDataGroup[]) => {
      if (!Array.isArray(item)) {
        if (getBannerId(item)) {
          return new AdvancedBanner(
            [item],
            getBannerId(item),
            getBannerColor(item),
            getBannerIcon(item)
          );
        }
        return item;
      }

      return new AdvancedBanner(
        item,
        getBannerId(item[0]),
        getBannerColor(item[0]),
        getBannerIcon(item[0])
      );
    });
  }
}

function getBannerId(g: TDataGroup) {
  if (g instanceof BlockGroup) {
    return g.op.attributes[BANNER_ID_ATTR_KEY] || '';
  } else if (g instanceof ListGroup) {
    return g.bannerId || '';
  } else if (g instanceof BlotBlock) {
    return g.op.attributes[BANNER_ID_ATTR_KEY] || '';
  }
  return '';
}

function getBannerColor(g: TDataGroup) {
  if (g instanceof BlockGroup) {
    return g.op.attributes[BANNER_COLOR_ATTR_KEY] || '';
  } else if (g instanceof ListGroup) {
    return g.bannerColor || '';
  } else if (g instanceof BlotBlock) {
    return g.op.attributes[BANNER_COLOR_ATTR_KEY] || '';
  }
  return '';
}

function getBannerIcon(g: TDataGroup) {
  if (g instanceof BlockGroup) {
    return g.op.attributes[BANNER_ICON_ATTR_KEY] || '';
  } else if (g instanceof ListGroup) {
    return g.bannerIcon || '';
  } else if (g instanceof BlotBlock) {
    return g.op.attributes[BANNER_ICON_ATTR_KEY] || '';
  }
  return '';
}

import {
  TDataGroup,
  BlockGroup,
  ListGroup,
  BlotBlock,
  AdvancedBanner,
} from './group-types';
import { groupConsecutiveElementsWhile } from '../helpers/array';

export const BANNER_ID_ATTR_KEY = 'advanced-banner';
export const BANNER_COLOR_ATTR_KEY = 'advanced-banner-color';
export const BANNER_ICON_ATTR_KEY = 'advanced-banner-icon';
export const BANNER_IN_LIST_ATTR_KEY = 'advanced-banner-in-list';
export const BANNER_LIST_INDENT_ATTR_KEY = 'advanced-banner-list-indent';

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
            getBannerIcon(item),
            getBannerInList(item),
            getBannerListIndent(item),
            getBannerLayout(item)
          );
        }
        return item;
      }

      return new AdvancedBanner(
        item,
        getBannerId(item[0]),
        getBannerColor(item[0]),
        getBannerIcon(item[0]),
        getBannerInList(item[0]),
        getBannerListIndent(item[0]),
        getBannerLayout(item[0])
      );
    });
  }
}

function getBannerId(g: TDataGroup) {
  return getBannerAttr(g, BANNER_ID_ATTR_KEY, 'bannerId');
}

function getBannerColor(g: TDataGroup) {
  return getBannerAttr(g, BANNER_COLOR_ATTR_KEY, 'bannerColor');
}

function getBannerIcon(g: TDataGroup) {
  return getBannerAttr(g, BANNER_ICON_ATTR_KEY, 'bannerIcon');
}

function getBannerInList(g: TDataGroup) {
  return getBannerAttr(g, BANNER_IN_LIST_ATTR_KEY, 'bannerInList');
}

function getBannerListIndent(g: TDataGroup) {
  return getBannerAttr(g, BANNER_LIST_INDENT_ATTR_KEY, 'bannerListIndent');
}

function getBannerLayout(g: TDataGroup) {
  return getBannerAttr(g, 'layout', 'layout');
}

function getBannerAttr(
  g: TDataGroup,
  key: string,
  keyForListGroup: string
): string {
  if (g instanceof BlockGroup) {
    return g.op.attributes[key] || '';
  } else if (g instanceof ListGroup) {
    return g[keyForListGroup] || '';
  } else if (g instanceof BlotBlock) {
    return g.op.attributes[key] || '';
  }
  return '';
}

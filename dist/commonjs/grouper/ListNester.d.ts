import { TDataGroup } from './group-types';
declare class ListNester {
  blocksCanBeWrappedWithList: string[];
  constructor(blocksCanBeWrappedWithList?: string[]);
  nest(groups: TDataGroup[]): TDataGroup[];
  private convertListBlocksToListGroups;
  private groupConsecutiveListGroups;
  private nestListSection;
  private groupByIndent;
  private placeUnderParent;
}
export { ListNester };

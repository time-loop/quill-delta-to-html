import { TDataGroup } from './group-types';
export declare class TableGrouper {
  blocksCanBeWrappedWithList: string[];
  constructor(blocksCanBeWrappedWithList?: string[]);
  group(groups: TDataGroup[]): TDataGroup[];
  private convertTableBlocksToTableGroups;
  private convertTableBlocksToTableRows;
  private convertTableBlocksToTableCells;
  private convertTableColBlocksToTableColGroup;
}

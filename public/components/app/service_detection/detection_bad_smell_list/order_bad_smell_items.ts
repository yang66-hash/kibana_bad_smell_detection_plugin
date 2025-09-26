
import { orderBy } from 'lodash';
import { BadSmellDetectionFieldName } from '../../../../../common/service_inventory';
import { BadSmellListItem } from '../../../../../common/interfaces/interfaces';

type SortValueGetter = (item: BadSmellListItem) => string | number;

const sorts: Record<BadSmellDetectionFieldName, SortValueGetter> = {
  [BadSmellDetectionFieldName.BadSmellName]: (item) => item.badSmellName.toLowerCase(),
  [BadSmellDetectionFieldName.Detectable]: (item) => item.detectable === true ? 1 : 0,
  [BadSmellDetectionFieldName.PrimaryCategory]: (item) => item.primaryCategory.toLowerCase(),
  [BadSmellDetectionFieldName.SecondaryCategory]: (item) => item.secondaryCategory.toLowerCase(),
  [BadSmellDetectionFieldName.DetectMethod]: (item) => item.detectMethod!.toLowerCase(),
  [BadSmellDetectionFieldName.ActiveStatus]: (item) => item.activeStatus === true ? 1 : 0,
  [BadSmellDetectionFieldName.Actions]: (item) => item.activeStatus === true ? 1 : 0,
};

export function orderBadSmellItems({
  items,
  primarySortField,
  sortDirection,
}: {
  items: BadSmellListItem[];
  primarySortField: string;
  sortDirection: 'asc' | 'desc';
}): BadSmellListItem[] {

  const sortFn = sorts[primarySortField as BadSmellDetectionFieldName];

  return orderBy(items, [sortFn], [sortDirection]);
}

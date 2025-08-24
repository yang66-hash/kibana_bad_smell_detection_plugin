import { orderBy } from 'lodash';
import { DetectionResTableListItem } from '../../../../../common/interfaces/interfaces';
import {
  ServiceDetectionResultsFieldName,
} from '../../../../../common/service_inventory';

type SortValueGetter = (item: DetectionResTableListItem) => string | number;


const sorts: Record<ServiceDetectionResultsFieldName, SortValueGetter> = {
  [ServiceDetectionResultsFieldName.ServiceName]: (item) => item.targetInstance.toLowerCase(),
  [ServiceDetectionResultsFieldName.Healthy]: (item) =>  `${item.status}`,
  [ServiceDetectionResultsFieldName.WarningStatus]: (item) =>  item.involvedBSPriType.length,
};

export function orderDetectionResultsItems({
  items,
  primarySortField,
  sortDirection,
}: {
  items: DetectionResTableListItem[];
  primarySortField: string;
  sortDirection: 'asc' | 'desc';
}): DetectionResTableListItem[] {
  const sortFn = sorts[primarySortField as ServiceDetectionResultsFieldName];

 
  return orderBy(items, [sortFn], [sortDirection]);
}

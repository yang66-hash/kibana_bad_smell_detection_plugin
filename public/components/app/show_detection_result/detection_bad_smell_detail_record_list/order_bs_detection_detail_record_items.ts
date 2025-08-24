/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
import { orderBy } from 'lodash';
import { BadSmellDetectionDetailRecordFieldName } from '../../../../../common/service_inventory';
import { DetectionResListItem } from '../../../../../common/interfaces/interfaces';

type SortValueGetter = (item: DetectionResListItem) => string | number;

const sorts: Record<BadSmellDetectionDetailRecordFieldName, SortValueGetter> = {
  [BadSmellDetectionDetailRecordFieldName.BadSmellRecord]: (item) => item.name.toLowerCase(),
  [BadSmellDetectionDetailRecordFieldName.BadSmellDetectionID]: (item) => item.detectionID.toLowerCase(),
  [BadSmellDetectionDetailRecordFieldName.detectTime]: (item) => item.timestamp.toLowerCase(),
  [BadSmellDetectionDetailRecordFieldName.Actions]: (item) => (item.status === true ? 1 : 0)
};

export function orderBadSmellDetectionDetailRecordItems({
  items,
  primarySortField,
  sortDirection,
}: {
  items: DetectionResListItem[];
  primarySortField: string;
  sortDirection: 'asc' | 'desc';
}): DetectionResListItem[] {

  const sortFn = sorts[primarySortField as BadSmellDetectionDetailRecordFieldName];
  items =  orderBy(items, [sortFn], [sortDirection]);
  return items;
}

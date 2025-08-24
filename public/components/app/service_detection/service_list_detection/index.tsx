/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import {
  EuiBadge,
  EuiFlexGroup,
  EuiFlexItem,
  EuiIcon,
  EuiIconTip,
  EuiLink,
  EuiSpacer,
  EuiTableSelectionType,
  EuiText,
  EuiToolTip,
  RIGHT_ALIGNMENT,
} from '@elastic/eui';
import { i18n } from '@kbn/i18n';

import { TypeOf } from '@kbn/typed-react-router-config';
import { omit } from 'lodash';
import React, { useMemo, useState } from 'react';
import {
  ServiceDetectionFieldName,
  ServiceInventoryFieldName,
  ServiceListItem,
} from '../../../../../common/service_inventory';
import { useBSDParams } from '../../../../hooks/use_bsd_params';
import { FETCH_STATUS, isFailure, isPending } from '../../../../hooks/use_fetcher';
import { BSDRoutes } from '../../../routing/bsd_route_config';
import { ServiceLink } from '../../../shared/links/apm/service_link';
import {
  ITableColumn,
  ManagedTable,
  SortFunction,
  TableSearchBar,
} from '../../../shared/managed_table';

export function getDetectionServiceColumns({
  dynamicOption,
  query,
  serviceOverflowCount,
}: {
  query: TypeOf<BSDRoutes, '/detect'>['query'];
  dynamicOption:boolean;
  serviceOverflowCount: number;
}): Array<ITableColumn<ServiceListItem>> {
  const columns:Array<ITableColumn<ServiceListItem>>  = [
    {
      field: ServiceDetectionFieldName.ServiceName,
      name: 'Name',
      sortable: true,
      render: (_, { serviceName, agentName }) => (
        <ServiceLink
          agentName={agentName}
          query={{ ...query }}
          serviceName={serviceName}
          serviceOverflowCount={serviceOverflowCount}
        />
      ),
    },
      //add column of detectable
    {
      field: ServiceDetectionFieldName.Detectable,
      name: 'Detectable',
      sortable: true,
      //all detection  status set as true
      render: (_, {detectable=true}) => (
        detectable ? 
        <EuiBadge color='success'>Detectable</EuiBadge> : 
        <EuiBadge color='warning'>Undetectable</EuiBadge>
      ),
    }

  ];

  if(dynamicOption){
    columns.pop();
  }

  return columns;
}

interface Props {
  status: FETCH_STATUS;
  items: ServiceListItem[];
  noItemsMessage?: React.ReactNode;
  initialSortField: ServiceInventoryFieldName;
  initialPageSize: number;
  initialSortDirection: 'asc' | 'desc';
  sortFn: SortFunction<ServiceListItem>;
  serviceOverflowCount: number;
  maxCountExceeded: boolean;
  onChangeSearchQuery: (searchQuery: string) => void;
  onChangeRenderedItems: (renderedItems: ServiceListItem[]) => void;
  isTableSearchBarEnabled: boolean;
  itemId?: string;
  selection?:  EuiTableSelectionType<ServiceListItem>;
  dynamicOption:boolean;
}
export function DetectionServiceList({
  status,
  items,
  noItemsMessage,
  initialSortField,
  initialSortDirection,
  initialPageSize,
  sortFn,
  serviceOverflowCount,
  maxCountExceeded,
  onChangeSearchQuery,
  onChangeRenderedItems,
  isTableSearchBarEnabled,
  itemId,
  selection,
  dynamicOption,
}: Props) {

  const { query } = useBSDParams('/');

  const serviceColumns = useMemo(() => {
    return getDetectionServiceColumns({
      // removes pagination and sort instructions from the query so it won't be passed down to next route
      query: omit(query, 'page', 'pageSize', 'sortDirection', 'sortField'),
      dynamicOption,
      serviceOverflowCount,
    });
  }, [
    query,
    serviceOverflowCount,
  ]);

  const tableSearchBar: TableSearchBar<ServiceListItem> = useMemo(() => {
    return {
      isEnabled: isTableSearchBarEnabled,
      fieldsToSearch: ['serviceName'],
      maxCountExceeded,
      onChangeSearchQuery,
      placeholder: 'Search services by name',
    };
  }, [isTableSearchBarEnabled, maxCountExceeded, onChangeSearchQuery]);

  return (
    <EuiFlexGroup gutterSize="xs" direction="column" responsive={false}>
      <EuiFlexItem>
        <EuiFlexGroup alignItems="center" gutterSize="xs" justifyContent="flexEnd">
          {maxCountExceeded && (
            <EuiFlexItem grow={false}>
              <EuiToolTip
                position="top"
                content={i18n.translate('xpack.apm.servicesTable.tooltip.maxCountExceededWarning', {
                  defaultMessage:
                    'The limit of 1,000 services is exceeded. Please use the query bar to narrow down the results or create service groups.',
                })}
              >
                <EuiIcon type="warning" color="danger" />
              </EuiToolTip>
            </EuiFlexItem>
          )}
        </EuiFlexGroup>
      </EuiFlexItem>
      <EuiFlexItem>
        <ManagedTable<ServiceListItem>
          isLoading={isPending(status)}
          error={isFailure(status)}
          columns={serviceColumns}
          items={items}
          noItemsMessage={noItemsMessage}
          initialSortField={initialSortField}
          initialSortDirection={initialSortDirection}
          initialPageSize={initialPageSize}
          sortFn={sortFn}
          onChangeRenderedItems={onChangeRenderedItems}
          tableSearchBar={tableSearchBar}
          itemId={itemId}
          selection={selection}
        />
      </EuiFlexItem>
    </EuiFlexGroup>
  );
}

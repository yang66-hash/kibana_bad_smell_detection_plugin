/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import {
    EuiBadge,
    EuiButton,
    EuiButtonIcon,
    EuiFlexGroup,
    EuiFlexItem,
    EuiHealth,
    EuiLink,
    EuiTableSelectionType,
    EuiText,
    EuiToolTip,
  } from '@elastic/eui';
import { euiStyled } from '@kbn/kibana-react-plugin/common';
  import React, { useMemo } from 'react';
  import {
    BadSmellDetectionFieldName,
  } from '../../../../../common/service_inventory';
  import { FETCH_STATUS, isFailure, isPending } from '../../../../hooks/use_fetcher';
  import {
    ITableColumn,
    ManagedTable,
    SortFunction,
    TableSearchBar,
  } from '../../../shared/managed_table';
  import { truncate } from '../../../../utils/style';
import { useBSDRouter } from '../../../../hooks/use_bsd_router';
import { BadSmellListItem } from '../../../../../common/interfaces/interfaces';


const StyledLink = euiStyled(EuiLink)`${truncate('100%')};`;

export function getBadSmellColumns({
  dynamicOption,
  runningServiceNum,
  link
}: {
  dynamicOption:boolean;
  runningServiceNum?:number;
  link: any;
}): Array<ITableColumn<BadSmellListItem>> {


const columns: Array<ITableColumn<BadSmellListItem>> = [
            {
              field: BadSmellDetectionFieldName.BadSmellName,
              name: 'Name',
              sortable: true,
              render: (_, { badSmellName }) => {
                return (
                  <StyledLink
                    href={link('/bad_smell', {query: { name: encodeURIComponent(badSmellName) }})}
              >
                <EuiFlexGroup alignItems="center" gutterSize="s" responsive={false}>
                  <EuiFlexItem className="eui-textTruncate">
                    <span className="eui-textTruncate">{badSmellName}</span>
                  </EuiFlexItem>
                </EuiFlexGroup>
              </StyledLink>
                );
              } 
            },
            {
              field: BadSmellDetectionFieldName.PrimaryCategory,
              name: 'FurtherType',
              sortable: true,
              render: (_, {secondaryCategory}) => (
                <EuiBadge color='#33cfff'>{secondaryCategory}</EuiBadge>
              ),
            },
              //add column of detectable
            {
              field: BadSmellDetectionFieldName.Detectable,
              name: 'Detectable',
              sortable: true,
              render: (_, {detectable}) => (
                detectable ? 
                <EuiBadge color='success'>Detectable</EuiBadge> : 
                <EuiBadge color='warning'>Undetectable</EuiBadge>
              ),
            },
            //add column of detectable
            {
              field: BadSmellDetectionFieldName.ActiveStatus,
              name: 'ActiveStatus',
              sortable: true,
              render: (_, {activeStatus}) => (
                <EuiHealth color={activeStatus ? 'success' : 'danger'}>
                  {activeStatus ? 'Online' : 'Offline'}
                </EuiHealth>
              ),
            }

          ];

  if(dynamicOption){
    columns.splice(1,0, {
      field: BadSmellDetectionFieldName.PrimaryCategory,
      name: 'PrimaryType',
      sortable: true,
      render: (_, {primaryCategory}) => (
        <EuiBadge color='#33b6ff'>{primaryCategory}</EuiBadge>
      ),
    });
    // columns.push({
    //   field: BadSmellDetectionFieldName.Actions,
    //   name: 'Actions',
    //   sortable: true,
    //   render: (_, {activeStatus,detectable}) => {
    //     const isDisabled = runningServiceNum === undefined || runningServiceNum === 0 || !activeStatus || !detectable;
    //     console.log("in detection button: ",{runningServiceNum, activeStatus,detectable});
    //     return (
    //       isDisabled ? (
    //         <EuiToolTip content="Can only be used when there are running services, detectable is true, and the active status is online.">
    //           <EuiButton 
    //             iconSide="right" 
    //             iconType="arrowRight" 
    //             size="s" 
    //             isDisabled={isDisabled}>
    //             Detect
    //           </EuiButton>
    //         </EuiToolTip>
    //       ) : (
    //         <EuiButton 
    //           iconSide="right" 
    //           iconType="arrowRight" 
    //           size="s" 
    //           isDisabled={isDisabled}>
    //           Detect
    //         </EuiButton>
    //       ))
    //     }
    // })
  }
  return columns; 
}

interface Props {
  status: FETCH_STATUS;
  items: BadSmellListItem[];
  noItemsMessage?: React.ReactNode;
  initialSortField: BadSmellDetectionFieldName;
  initialPageSize: number;
  initialSortDirection: 'asc' | 'desc';
  sortFn: SortFunction<BadSmellListItem>;
  maxCountExceeded: boolean;
  onChangeSearchQuery: (searchQuery: string) => void;
  onChangeRenderedItems: (renderedItems: BadSmellListItem[]) => void;
  isTableSearchBarEnabled: boolean;
  itemId?:string;
  selection?: EuiTableSelectionType<BadSmellListItem>;
  dynamicOption:boolean;
  runningServiceNum?:number;
}
export function DetectionBadSmellList({
  status,
  items,
  noItemsMessage,
  initialSortField,
  initialSortDirection,
  initialPageSize,
  sortFn,
  maxCountExceeded,
  onChangeSearchQuery,
  onChangeRenderedItems,
  isTableSearchBarEnabled,
  itemId,
  selection,
  dynamicOption,
  runningServiceNum
}: Props) {
  const { link } = useBSDRouter();

  const serviceColumns = useMemo(() => {
    return getBadSmellColumns({
      dynamicOption,
      runningServiceNum,
      link
    });
  }, [runningServiceNum]);

  const tableSearchBar: TableSearchBar<BadSmellListItem> = useMemo(() => {
    return {
      isEnabled: isTableSearchBarEnabled,
      fieldsToSearch: ['badSmellName'],
      maxCountExceeded,
      onChangeSearchQuery,
      placeholder: 'Search bad smell by name',
    };
  }, [isTableSearchBarEnabled, maxCountExceeded, onChangeSearchQuery]);

  return (
    <EuiFlexGroup gutterSize="xs" direction="column" responsive={false}>
      <EuiFlexItem>
        <ManagedTable<BadSmellListItem>
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

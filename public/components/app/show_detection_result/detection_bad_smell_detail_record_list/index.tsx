import {
    EuiBadge,
    EuiButton,
    EuiButtonEmpty,
    EuiButtonIcon,
    EuiFlexGroup,
    EuiFlexItem,
    EuiIcon,
    EuiSpacer,
    EuiTableSelectionType,
    EuiText,
    EuiTextColor,
    EuiToolTip,
  } from '@elastic/eui';
  import React, { useMemo, useState } from 'react';
  import {
    BadSmellDetectionDetailRecordFieldName,
  } from '../../../../../common/service_inventory';
  import { FETCH_STATUS, isFailure, isPending } from '../../../../hooks/use_fetcher';
  import {
    ITableColumn,
    ManagedTable,
    SortFunction,
    TableSearchBar,
  } from '../../../shared/managed_table';
import { useBSDRouter } from '../../../../hooks/use_bsd_router';
import { DetectionResListItem } from '../../../../../common/interfaces/interfaces';
import { UpdatedAtField } from '../../service_detection/service_list_detection_results/updated_at_field';
import { FormattedRelative } from '@kbn/i18n-react';
import { useHistory } from 'react-router-dom';
import { DetailIntroFlayout } from '../detail_intro_flayout';

export function getDetectionDetailRecordsColumns({
  setFlyoutVisible,
  setcurHitItem
}: {
  link: any;
  setFlyoutVisible:(isFlyoutVisible:boolean)=> void;
  setcurHitItem: (item: DetectionResListItem) => void;
}): Array<ITableColumn<DetectionResListItem>> {


const columns: Array<ITableColumn<DetectionResListItem>> = [
            {
              field: BadSmellDetectionDetailRecordFieldName.BadSmellRecord,
              name: 'Name, result, tags',
              sortable: true,
              render: (_, { name, categoryName, typeName, status   }) => (
                <>
                <EuiFlexGroup direction='column'>
                  <EuiFlexItem grow={false}>
                    <EuiFlexGroup>
                      <EuiText size="m" color={'#4A90E2'}>{name}</EuiText>
                      {status &&(
                        <EuiIcon type="warning" color='danger' size='m'/>
                      )}
                    </EuiFlexGroup>
                    
                  </EuiFlexItem>
                  <EuiFlexItem grow={false}>
                    <EuiFlexGroup>
                        <EuiFlexItem grow={false}>
                          <EuiBadge color='#006bb8'>{categoryName}</EuiBadge>
                        </EuiFlexItem>
                        <EuiFlexItem grow={false}>
                          <EuiBadge color='warning'>{typeName}</EuiBadge>
                        </EuiFlexItem>
                    </EuiFlexGroup>
                  </EuiFlexItem>
                </EuiFlexGroup>
                    
                </>
                
              ),
            },
            {
              field: BadSmellDetectionDetailRecordFieldName.BadSmellDetectionID,
              name: 'Job ID',
              width: '30%',
              sortable: true,
              render: (_, {detectionID}) => (
                <span>{detectionID}</span>
              ),
            },
            {
              field: BadSmellDetectionDetailRecordFieldName.detectTime,
              name: 'Detect Time',
              width: '25%',
              sortable: true,
              render: (_, {timestamp}) => (
                <UpdatedAtField dateTime={timestamp} DateFormatterComp={(props) => <FormattedRelative {...props} />} />
              ),
            },
            {
              field: BadSmellDetectionDetailRecordFieldName.Actions,
              name: 'Actions',
              sortable: true,
              width: '9%',
              render: (_, item) => {
                const {status} = item;
                return (
                  !status ? (
                    <EuiToolTip position='top' content="Health Record without details.">
                      <EuiButtonIcon 
                      iconType="search"
                      aria-label="search detail" 
                      />
                    </EuiToolTip>
                      
                  ) : (
                    <EuiButtonIcon
                     iconType="search"
                      aria-label="search detail"
                      onClick={()=>{
                        setFlyoutVisible(true);
                        setcurHitItem(item);
                      }}/>
                  ))
                }
            }

          ];
  return columns; 
}

interface Props {
  status: FETCH_STATUS;
  items: DetectionResListItem[];
  noItemsMessage?: React.ReactNode;
  initialSortField: BadSmellDetectionDetailRecordFieldName;
  initialPageSize: number;
  initialSortDirection: 'asc' | 'desc';
  sortFn: SortFunction<DetectionResListItem>;
  maxCountExceeded: boolean;
  onChangeSearchQuery: (searchQuery: string) => void;
  onChangeRenderedItems: (renderedItems: DetectionResListItem[]) => void;
  isTableSearchBarEnabled: boolean;
  itemId: string;
  selection?:  EuiTableSelectionType<DetectionResListItem>;
  setFlyoutVisible:(isFlyoutVisible:boolean)=> void;
  setcurHitItem: (item: DetectionResListItem) => void;
}
export function DetectionBSRecordDetailList({
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
  setFlyoutVisible,
  setcurHitItem
}: Props) {
  const { link } = useBSDRouter();


  const serviceColumns = useMemo(() => {
    return getDetectionDetailRecordsColumns({
      link,
      setFlyoutVisible,
      setcurHitItem,
    });
  }, []);

  const tableSearchBar: TableSearchBar<DetectionResListItem> = useMemo(() => {
    return {
      isEnabled: isTableSearchBarEnabled,
      fieldsToSearch: ['name'],
      maxCountExceeded,
      onChangeSearchQuery,
      placeholder: 'filter by bad smell name',
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
                content='The limit of 1,000 records is exceeded. Please use the query bar to narrow down the results.'
              >
                <EuiIcon type="warning" color="danger" />
              </EuiToolTip>
            </EuiFlexItem>
          )}
        </EuiFlexGroup>
      </EuiFlexItem>
      <EuiFlexItem>
        <ManagedTable<DetectionResListItem>
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

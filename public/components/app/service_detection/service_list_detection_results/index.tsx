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
  import React, { useEffect, useMemo, useState } from 'react';
  import {
    ServiceDetectionResultsFieldName,
  } from '../../../../../common/service_inventory';
  import { useBSDParams } from '../../../../hooks/use_bsd_params';
  import { FETCH_STATUS, isFailure, isPending } from '../../../../hooks/use_fetcher';
  import { BSDRoutes } from '../../../routing/bsd_route_config';
  import {
    ITableColumn,
    ManagedTable,
    SortFunction,
    TableSearchBar,
  } from '../../../shared/managed_table';
import { BSCateIcon} from '../../../../../public/assets/external_icon';
import { DetectionResTableListItem } from '../../../../../common/interfaces/interfaces';
import { useHistory } from 'react-router-dom';
import { fromQuery, toQuery } from '../../../shared/links/url_helpers';
import { useDetectionRes } from '../../../../../public/hooks/use_detection_result_context';
 



export function getDetectionResColumns({
    query,
    redirectToDetailRecords,
    setDetectionResItem
  }: {
    query: TypeOf<BSDRoutes, '/display'>['query'];
    redirectToDetailRecords:(categoryName: string)=>void;
    setDetectionResItem:(detectionItem:DetectionResTableListItem)=>void;
  }): Array<ITableColumn<DetectionResTableListItem>> {


    const columns:Array<ITableColumn<DetectionResTableListItem>>  = [
      {
        field: ServiceDetectionResultsFieldName.ServiceName,
        name: 'serviceName',
        sortable: true,
        render: (_, { targetInstance }) => (
          <EuiBadge color='hollow'>{targetInstance}</EuiBadge>
        ),
      },
      {
        field: ServiceDetectionResultsFieldName.Healthy,
        name: 'Healthy',
        sortable: true,
        render: (_, {status, involvedBSPriType}) => {
          if(!status){
            return (
              <EuiBadge color='success'>Healthy</EuiBadge>
            );
          }
          else if(involvedBSPriType.length<=2){
            return (
              <EuiBadge color='warning'>Warning</EuiBadge>
            );
          }else{
            return (
              <EuiBadge color='danger'>Unhealthy</EuiBadge>
            );
          }
        },
      },
      {
        field: ServiceDetectionResultsFieldName.WarningStatus,
        name: 'InvolvedBSCategory',
        sortable: true,
        render: (_, item) => {
          const {involvedBSPriType} = item;
          return (
            <div style={{ 
              display: 'flex', 
              flexWrap: 'wrap', 
              gap: '8px',
              alignItems: 'center'
            }}>
              {involvedBSPriType.sort().map((value) => {
                const index = value.trim();
                return (
                  <div key={index} style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    padding: '4px',
                    borderRadius: '4px',
                    backgroundColor: '#F5F7FA',
                    marginRight: '4px'
                  }}>
                    <EuiToolTip position="top" content="Go for details">
                      <BSCateIcon 
                        badSmellCate={index}
                        style={{ 
                          cursor: 'pointer'
                        }}
                        onClick={(event: React.MouseEvent<SVGSVGElement>) => {
                          event.preventDefault();
                          event.stopPropagation();
                          setDetectionResItem(item);
                          console.log("detect in service list results ...", item);
                          redirectToDetailRecords(index);
                        }}
                      />
                    </EuiToolTip>
                  </div>
                );
              })}
            </div>
          );
        },
      },
      // {
      //   field: ServiceDetectionResultsFieldName.WarningStatus,
      //   name: 'InvolvedBSDetail',
      //   sortable: true,
      //   render: (_, {involvedBSSet}) => {
            
      //       return (
      //           <div>
      //               {involvedBSSet.map((index) => (
      //                 <EuiBadge color='warning'>{index}</EuiBadge>
      //               ))}
      //           </div>
      //           );
      //   },
      // }
  
  
    ];
    return columns;
  }
  


  interface Props {
    status: FETCH_STATUS;
    items: DetectionResTableListItem[];
    noItemsMessage?: React.ReactNode;
    initialSortField: ServiceDetectionResultsFieldName;
    initialPageSize: number;
    initialSortDirection: 'asc' | 'desc';
    sortFn: SortFunction<DetectionResTableListItem>;
    maxCountExceeded: boolean;
    onChangeSearchQuery: (searchQuery: string) => void;
    onChangeRenderedItems: (renderedItems: DetectionResTableListItem[]) => void;
    isTableSearchBarEnabled: boolean;
  }
  export function DetectionResultsList({
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
  }: Props) {
  
  //use to set DetectionResTableListItem as context in ShowDetectionResultOverview
    const { setDetectionResItem } = useDetectionRes();

    const { query } = useBSDParams('/display');
    const history = useHistory();

    const redirectToDetailRecords = (categoryName:string)=>{


      console.log("redirectToDetailRecords: ", categoryName);
        history.push({
          pathname:'/display/cate/details',
          search: fromQuery({
            ...toQuery(location.search),
            badSmellType: categoryName
          }),
        });
    }
    const serviceColumns = useMemo(() => {
      return getDetectionResColumns({
        query: omit(query, 'page', 'pageSize', 'sortDirection', 'sortField'),
        redirectToDetailRecords,
        setDetectionResItem
      });
    }, [
      query,
    ]);
  
    const tableSearchBar: TableSearchBar<DetectionResTableListItem> = useMemo(() => {
      return {
        isEnabled: isTableSearchBarEnabled,
        fieldsToSearch: ['targetInstance'],
        maxCountExceeded,
        onChangeSearchQuery,
        placeholder: 'Search services by service name',
      };
    }, [isTableSearchBarEnabled, maxCountExceeded, onChangeSearchQuery]);
  
    return (
      <EuiFlexGroup gutterSize="xs" direction="column" responsive={false}>
        <EuiFlexItem>
          <ManagedTable<DetectionResTableListItem>
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
          />
        </EuiFlexItem>
      </EuiFlexGroup>
    );
  }
  
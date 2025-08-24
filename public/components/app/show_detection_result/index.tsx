import { EuiButton, EuiEmptyPrompt, EuiFlexGrid, EuiFlexGroup, EuiFlexItem, EuiLink, EuiPanel, EuiProgress, EuiSpacer, EuiStat, EuiSuperDatePicker, EuiText, OnRefreshProps, OnTimeChangeProps } from "@elastic/eui";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { DetectionShowBoard } from "../detection_res_show_board";
import { DetectionResTableListItem, IBadSmellType, IBSDStatistics } from "../../../../common/interfaces/interfaces";
import { useStateDebounced } from "../../../../public/hooks/use_debounce";
import { SortFunction } from "../../shared/managed_table";
import { ServiceDetectionResultsFieldName } from "../../../../common/service_inventory";
import { orderDetectionResultsItems } from "../service_detection/service_list_detection_results/order_results_items";
import { FETCH_STATUS } from "../../../../public/hooks/use_fetcher";
import { Link, useHistory } from "react-router-dom";
import { fromQuery, toQuery } from "../../shared/links/url_helpers";
import styled from '@emotion/styled';
import { BSDPluginStartDeps } from "../../../../public/plugin";
import { useKibana } from "@kbn/kibana-react-plugin/public";
import { useTimeRange } from "../../../hooks/use_time_range";
import { DetectionResultsList } from "../service_detection/service_list_detection_results";
import { INITIAL_PAGE_SIZE } from "../../../../public/hooks/use_service_statistics_fetcher";
import { useBSSetTypeDataFetcher } from "../../../../public/hooks/use_bad_smell_type_fetcher";
import { statisticsDefault } from "./detection_result_info";
import { BSDMainTemplate } from "../../routing/templates/bsd_main_template";
const Stat = styled(EuiStat)`
  .euiText {
    line-height: 1;
  }
`;

function compareByName(a:IBadSmellType, b:IBadSmellType) {
  if (a.name < b.name) {
    return -1; 
  }
  if (a.name > b.name) {
    return 1;
  }
  return 0; 
}

export function ShowDetectionResultView(){


    const {BSTypeSet} =  useBSSetTypeDataFetcher();


    const [isLoading, setLoading] = useState<FETCH_STATUS>(FETCH_STATUS.LOADING);
    const [debouncedSearchQuery, setDebouncedSearchQuery] = useStateDebounced('');
    const [renderedItems, setRenderedItems] = useState<DetectionResTableListItem[]>([]);
    const initialSortField = ServiceDetectionResultsFieldName.ServiceName;

    const initialSortDirection = 'desc';
    const sortFn: SortFunction<DetectionResTableListItem> = useCallback(
      (itemsToSort, sortField, sortDirection) => {
        return orderDetectionResultsItems({
          items: itemsToSort,
          primarySortField: sortField,
          sortDirection
        });
      }, []
    );
  const noItemsMessage = useMemo(() => {
    return (
      <EuiEmptyPrompt
        title={
          <div>
            No Detection Record Searched
          </div>
        }
        titleSize="s"
      />
    );
  }, []);



  //detection result search bar

  const [totalNum, setTotalNum] = useState(0);
  const [isDatePickerLoading,setDatePickerLoading] = useState(false);
  const [startTime, setStartTime] = useState('now-45m');
  const [endTime, setEndTime] = useState('now');
  const { services } = useKibana<BSDPluginStartDeps>();
  const { http } = services;
  const { start, end } = useTimeRange({rangeFrom:startTime,rangeTo:endTime});
  const { start: thisWStart, end: thisWEnd } = useTimeRange({ rangeFrom: 'now-0w/w', rangeTo: 'now' });
  const { start: twoWStart, end: twoWEnd } = useTimeRange({ rangeFrom: 'now-1w/w', rangeTo: 'now' });

  const onTimeChange = ({ start, end }: OnTimeChangeProps) => {
    setStartTime(start);
    setEndTime(end);
  };
  
  const getBSDRecords = async () => {
    try {
        const response = await http?.get(`/api/bsd/detect_records`,{
          query:{
            start: start,
            end: end,
          }
        });
        console.log("start",startTime);
        console.log("start",endTime);
        setTotalNum(response.total);
        setRenderedItems(response.items);
        setLoading(FETCH_STATUS.SUCCESS);
        console.log(response);
    } catch (e: any) {
      setLoading(FETCH_STATUS.FAILURE);
        const errorMsg = e.response?.status
            ? `${e.response.status} ${e.message}`
            : e.message || 'Unknown error';
        console.error(errorMsg);
    }
  }

  const getBSDNumByWeek = async (start: string, end:string) => {
    try {
        const response = await http?.get(`/api/bsd/records_statistics`,{
          query:{
            start: start,
            end: end,
          }
        });
        return response.items;
    } catch (e: any) {
        const errorMsg = e.response?.status
            ? `${e.response.status} ${e.message}`
            : e.message || 'Unknown error';
        console.error(errorMsg);
        return [];
    }
  }

  //will initialize by statisticsDefault in detection_result_info.tsx
  const [thisWeekStatistics, setThisWStatistics] = useState<IBSDStatistics[]>(statisticsDefault);
  const [twoWeekStatistics, settwoWStatistics] = useState<IBSDStatistics[]>(statisticsDefault);

  useEffect(() =>{

    const fetchData = async () => {
      const thisWeekData:IBSDStatistics[] = await getBSDNumByWeek(thisWStart,thisWEnd);

      console.log("fetchData thisWeek", thisWeekData);

      setThisWStatistics((preStatistics)=>{
        const updatedStatistics = preStatistics.map((item)=>{
          const newItem = thisWeekData.find((newData)=> newData.categoryName === item.categoryName);
          return newItem? {...item, ...newItem} : item;
        })
        return updatedStatistics;
      });

      const twoWeekData:IBSDStatistics[] = await getBSDNumByWeek(twoWStart, twoWEnd);
      console.log("fetchData twoWeek", twoWeekData);
      settwoWStatistics((preStatistics)=>{
        const updatedStatistics = preStatistics.map((item)=>{
          const newItem = twoWeekData.find((newData)=> newData.categoryName === item.categoryName);
          return newItem? {...item, ...newItem} : item;
        })
        return updatedStatistics;
      });
    };

    fetchData();
  },[]);


  useEffect(()=>{
    const fetchData = async () => {
      setDatePickerLoading(true);
      await getBSDRecords(); 
      
      setDatePickerLoading(false);
      console.log("thisWeekStatistics ", thisWeekStatistics);
      console.log("twoWeekStatistics ", twoWeekStatistics);
    };
  
    fetchData();
  },[startTime,endTime,]);
  
    return (
        <>

          <BSDMainTemplate
          // determine whether to access /detect based on the existence of DETECTION_URL_KEY item
            pageTitle={"Detection Dashboard"}
            pageSectionProps={{
              contentProps: {
                style: {
                  display: 'flex',
                  flexGrow: 1,
                },
              },
            }}
          >

            <EuiFlexGroup direction='column' gutterSize='m'>
                <EuiFlexItem grow={false}>
                    <EuiFlexGroup direction="row" gutterSize='m'>
                        <EuiFlexItem grow={false}>
                          <EuiFlexGrid columns={3}>
                            {BSTypeSet.filter(item=>item.parentId===null).sort(compareByName).map((item,index)=>{
                            return (<DetectionShowBoard
                                key={index}
                                badSmellType={item}
                                iconType={"logoSecurity"}
                                thisWeekNum={thisWeekStatistics[index].count} 
                                twoWeekNum={twoWeekStatistics[index].count}/>
                            );
                          })}
                          </EuiFlexGrid>
                          
                            
                        </EuiFlexItem>
                    </EuiFlexGroup>
                </EuiFlexItem>

                <EuiFlexItem grow={false}>
                  <EuiPanel color="subdued" paddingSize="m">
                      <EuiFlexGroup alignItems='center' justifyContent='flexEnd'>
                    <EuiFlexItem grow={1}>
                        
                          <EuiFlexGroup alignItems='center' justifyContent="center">
                                <EuiText textAlign='center' style={{fontWeight:'bold'}}>
                                    Detection records
                                </EuiText>
                                <Stat
                                    title={totalNum}
                                    description= {<EuiText>Total</EuiText>}
                                    color="primary"
                                    titleSize="s"
                                />
                            </EuiFlexGroup>
                      </EuiFlexItem>

                      <EuiFlexItem grow={1}>
                        <EuiSuperDatePicker 
                          isLoading={isDatePickerLoading}
                          start={startTime}
                          end={endTime}
                          onTimeChange={onTimeChange}    
                        />
                      </EuiFlexItem>
                      </EuiFlexGroup>
                
              </EuiPanel>
              </EuiFlexItem>

                <EuiFlexItem grow={false}>
                    <EuiPanel>
                        <DetectionResultsList
                            status={isLoading}
                            items={renderedItems}
                            initialSortField={initialSortField}
                            initialSortDirection={initialSortDirection}
                            sortFn={sortFn}
                            noItemsMessage={noItemsMessage}
                            initialPageSize={INITIAL_PAGE_SIZE}
                            onChangeSearchQuery={()=>void 0}
                            maxCountExceeded={false}
                            onChangeRenderedItems={()=>void 0}
                            isTableSearchBarEnabled={false}
                            />
                    </EuiPanel>
                </EuiFlexItem>             
            </EuiFlexGroup>
          </BSDMainTemplate>
            

        
        </>
    );
}
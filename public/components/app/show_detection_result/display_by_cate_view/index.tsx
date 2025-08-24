import { EuiButton, EuiButtonIcon, EuiEmptyPrompt, EuiFlexGroup, EuiFlexItem, EuiPanel, EuiSelectableOption, EuiSuperDatePicker, EuiTableSelectionType, FieldValueOptionType, OnTimeChangeProps } from "@elastic/eui";
import { useTimeRange } from "../../../../../public/hooks/use_time_range";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { BSDMainTemplate } from "../../../routing/templates/bsd_main_template";
import { BSDFilterPanel } from "./tag_filter_panel/tag_filter.panel";
import { BSDPluginStartDeps } from "../../../../../public/plugin";
import { useKibana } from '@kbn/kibana-react-plugin/public';
import { DetectionResListItem } from "../../../../../common/interfaces/interfaces";
import { DetectionBSRecordDetailList } from "../detection_bad_smell_detail_record_list";
import { INITIAL_BS_PAGE_SIZE } from "../../../../../common/constants";
import { orderBadSmellDetectionDetailRecordItems } from "../detection_bad_smell_detail_record_list/order_bs_detection_detail_record_items";
import { BadSmellDetectionDetailRecordFieldName } from "../../../../../common/service_inventory";
import { SortFunction } from "../../../shared/managed_table";
import { FETCH_STATUS } from "../../../../../public/hooks/use_fetcher";
import { useDetectionRes } from "../../../../hooks/use_detection_result_context";
import { DetailIntroFlayout } from "../detail_intro_flayout";
import { useStateDebounced } from "../../../../../public/hooks/use_debounce";

export interface TagSelection {
    [tagId: string]: 'include' | 'exclude' | undefined;
  }

export function DisplayRecordsByCateView(){
    const {detectionResItem} = useDetectionRes();
    const { services } = useKibana<BSDPluginStartDeps>();
    const { http } = services;

    const [title,setTitle] = useState('');

    const [isDatePickerLoading,setDatePickerLoading] = useState(false);
    const [startTime, setStartTime] = useState('now-1M');
    const [endTime, setEndTime] = useState('now');
    const { start, end } = useTimeRange({rangeFrom:startTime,rangeTo:endTime});
    const onTimeChange = ({ start, end }: OnTimeChangeProps) => {
        setStartTime(start);
        setEndTime(end);
      };
    
    
    

    const [isBSDFilterPopoverOpen, setBSDFilterPopoverOpen] = useState(false);
    const closePopover = useCallback(() => {
        setBSDFilterPopoverOpen(false);
      }, []);
      const onFilterButtonClick = useCallback(() => {
        setBSDFilterPopoverOpen((prev) => !prev);
      }, []);

  //Detection BSD detail record list table
  const [BSDDebouncedSearchQuery, setBSDDebouncedSearchQuery] = useStateDebounced('');
  const initialBSDTableSortField = BadSmellDetectionDetailRecordFieldName.detectTime;
  const initialBSDTableSortDirection = 'desc';
  const sortBSFn: SortFunction<DetectionResListItem> = useCallback(
    (itemsToSort, sortField, sortDirection) => {
      let items = orderBadSmellDetectionDetailRecordItems({
        items: itemsToSort,
        primarySortField: sortField,
        sortDirection
      });
      setCurRenderedBSDRecordsItems(items);
      return items;
    }, []
  );
  const [renderedBSDRecordItems, setRenderedBSDRecordsItems] = useState<DetectionResListItem[]>([]);
  const [curRenderedBSDRecordItems, setCurRenderedBSDRecordsItems] = useState<DetectionResListItem[]>([]);

  const [BSDRecordsSelectedItems,setBSDRecordsSelectedItems] = useState<DetectionResListItem[]>([]);
  const [maxCountExceeded,setMaxCountExceeded] = useState(false);
  const [searchedPriType, setSearchedPriType] = useState<string[]>([]);
  const [isRecordListLoading, setRecordListLoading] = useState<FETCH_STATUS>(FETCH_STATUS.LOADING);
  const BSDResSelection: EuiTableSelectionType<DetectionResListItem> = {
    selectable: (item: DetectionResListItem) => true,
    onSelectionChange: (selectedItems: DetectionResListItem[]) => {
      setBSDRecordsSelectedItems(selectedItems);
    },
  };

  const noBSDRecordItemsMessage = useMemo(() => {
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

  const [options, setOptions] = useState<EuiSelectableOption[]>([]);

  const getFilteredData = async () => {
      try {
          setRecordListLoading(FETCH_STATUS.LOADING);
          const response = await http?.post(`/api/bsd/get_filterd_records`,{
            body: JSON.stringify({
              start: start,
              end: end,
              targetInstance: detectionResItem?.targetInstance,
              searchedPriType: searchedPriType,
            }),
          });
          console.log(response.items);
          if ('maxCountExceeded' in response) {
            setMaxCountExceeded(true);
          }
          setRenderedBSDRecordsItems(response.items);
          setCurRenderedBSDRecordsItems(response.items);
          setRecordListLoading(FETCH_STATUS.SUCCESS);
      } catch (e: any) {
          setRecordListLoading(FETCH_STATUS.FAILURE);
          const errorMsg = e.response?.status
              ? `${e.response.status} ${e.message}`
              : e.message || 'Unknown error';
          console.error(errorMsg);
      }
  };

  useEffect(()=>{
      setTitle(detectionResItem!.targetInstance);
      const priOptionsItems: EuiSelectableOption[] = [];
      detectionResItem?.involvedBSPriType.forEach((item)=>{
        let option: EuiSelectableOption = {
          label: item,
          checked: 'on',
      }
      setSearchedPriType(detectionResItem?.involvedBSPriType);
      priOptionsItems.push(option);
      });
      setOptions(priOptionsItems);
  },[]);

  useEffect(()=>{
    setSearchedPriType(options.filter(item=>item.checked==='on').map(item=>item.label));
  },[options]);

  useEffect(() => {
      const fetchData = async () => {
        setDatePickerLoading(true);
        await getFilteredData();
        setDatePickerLoading(false);
      }
      fetchData();
  },[start,end,searchedPriType,detectionResItem]);


  //fly out
  const [isFlyoutVisible, setFlyoutVisible] = useState<boolean>(false);
  const [curHitItem, setCurHitItem] = useState<DetectionResListItem|null>(null);
  const [expandedDoc, setExpandedDoc] = useState<DetectionResListItem>();

  useEffect(()=>{
    console.log("isFLyoutvisible: ", isFlyoutVisible);
  },[isFlyoutVisible]);
  let flyout;
  if(isFlyoutVisible){
    flyout = (
      <DetailIntroFlayout
        isFlyoutVisible={isFlyoutVisible}
        setIsFlyoutVisible={setFlyoutVisible}
        position={curRenderedBSDRecordItems.findIndex(item=>item.id === curHitItem?.id)}
        hit={curHitItem}
        hits={curRenderedBSDRecordItems} 
        setExpandedDoc={setExpandedDoc}        
       />
    );
  }
    return (
        <>
        <BSDMainTemplate
            pageTitle={title}
            pageSectionProps={{
            contentProps: {
                style: {
                display: 'flex',
                flexGrow: 1,
                },
            },
            }}
            >
            <EuiFlexGroup direction="column"  gutterSize='m'>
                <EuiFlexItem grow={false}>
                    <EuiFlexGroup direction='row' justifyContent="flexEnd">
                      {
                        BSDRecordsSelectedItems.length !== 0 && (
                                <EuiButton onClick={() => {}} color="danger" iconType="trash">
                                  Delete records
                              </EuiButton>
                      )}
                      <EuiFlexItem grow={false}>
                            
                      </EuiFlexItem>
                       <EuiFlexItem grow={false}>
                          <BSDFilterPanel 
                                      isPopoverOpen={isBSDFilterPopoverOpen}
                                      closePopover={closePopover}
                                      options={options}
                                      onFilterButtonClick={onFilterButtonClick}
                                      onSelectChange={(newOptions) => setOptions(newOptions)} 
                                      SelectAll={()=>void 0}
                          />             
                       </EuiFlexItem>
                      <EuiFlexItem grow={false} style={{ maxWidth: '40%' }}>
                          <EuiSuperDatePicker 
                          isLoading={isDatePickerLoading}
                          start={startTime}
                          end={endTime}
                          onTimeChange={onTimeChange}    
                          />
                      </EuiFlexItem>
                    </EuiFlexGroup>
                </EuiFlexItem>

                <EuiFlexItem grow={false}>
                    <EuiPanel>
                        <DetectionBSRecordDetailList
                        status={isRecordListLoading}
                        items={renderedBSDRecordItems}
                        initialSortField={initialBSDTableSortField}
                        initialSortDirection={initialBSDTableSortDirection}
                        sortFn={sortBSFn}
                        noItemsMessage={noBSDRecordItemsMessage}
                        initialPageSize={INITIAL_BS_PAGE_SIZE}
                        onChangeSearchQuery={setBSDDebouncedSearchQuery}
                        maxCountExceeded={maxCountExceeded}
                        onChangeRenderedItems={setCurRenderedBSDRecordsItems}
                        isTableSearchBarEnabled={true}
                        itemId="id"
                        selection={BSDResSelection}
                        setFlyoutVisible={setFlyoutVisible}
                        setcurHitItem={setCurHitItem}
                        />
                    </EuiPanel>
                </EuiFlexItem>
                {flyout}
            </EuiFlexGroup>
        </BSDMainTemplate>
        
        </>
    );
}
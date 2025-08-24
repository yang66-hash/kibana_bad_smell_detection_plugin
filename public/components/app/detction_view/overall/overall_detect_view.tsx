import { EuiButton, EuiEmptyPrompt, EuiFlexGroup, EuiFlexItem, EuiGlobalToastList, EuiGlobalToastListToast, EuiPanel, EuiProgress, EuiSpacer, EuiTableSelectionType, EuiText, EuiTextColor, EuiToast } from '@elastic/eui';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { SearchBar } from '../../../shared/search_bar/search_bar';

import { INITIAL_PAGE_SIZE, useServicesMainStatisticsFetcher } from '../../../../hooks/use_service_statistics_fetcher';
import { useStateDebounced } from '../../../../hooks/use_debounce';
import { BadSmellDetectionFieldName, ServiceInventoryFieldName, ServiceListItem } from '../../../../../common/service_inventory';
import { FETCH_STATUS } from '../../../../hooks/use_fetcher';
import { SortFunction } from '../../../shared/managed_table';
import { orderServiceItems } from '../../service_inventory/service_list/order_service_items';
import {DETECTION_URL_KEY, getBadSmellPrefixByName, INITIAL_BS_PAGE_SIZE} from '../../../../../common/constants';
import { DetectionServiceList } from '../../service_detection/service_list_detection';
import { DetectStats } from '../../detect_stat_com/detect_stat_com';
import { DetectionBadSmellList } from '../../service_detection/detection_bad_smell_list';
import { orderBadSmellItems } from '../../service_detection/detection_bad_smell_list/order_bad_smell_items';
import { BSDPluginStartDeps } from '../../../../..//public/plugin';
import { useKibana } from '@kbn/kibana-react-plugin/public';
import { useBSDParams } from '../../../../../public/hooks/use_bsd_params';
import useDeepCompareEffect from 'react-use/lib/useDeepCompareEffect';
import { BadSmellListItem } from '../../../../../common/interfaces/interfaces';
import { generateUUIDv4 } from '../../../../../common/utils/get_uuid';



export function OverallDetectView() {

  //services
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useStateDebounced('');
  const [renderedItems, setRenderedItems] = useState<ServiceListItem[]>([]);

  const mainStatisticsFetch = useServicesMainStatisticsFetcher(debouncedSearchQuery);
  const { mainStatisticsData, mainStatisticsStatus } = mainStatisticsFetch;

  const tiebreakerField = ServiceInventoryFieldName.ServiceName;

  const initialSortField = ServiceInventoryFieldName.ServiceName;

  const initialSortDirection = 'desc';
  const sortFn: SortFunction<ServiceListItem> = useCallback(
    (itemsToSort, sortField, sortDirection) => {
      return orderServiceItems({
        items: itemsToSort,
        primarySortField: sortField,
        sortDirection,
        tiebreakerField,
      });
    },
    [tiebreakerField]
  );

  const noItemsMessage = useMemo(() => {
    return (
      <EuiEmptyPrompt
        title={
          <div>
            No Microservices Found
          </div>
        }
        titleSize="s"
      />
    );
  }, []);
  const serviceOverflowCount = mainStatisticsData?.serviceOverflowCount ?? 0;
  const [serviceSelectedItems, setServiceSelectedItems] = useState<ServiceListItem[]>([]);

  const serviceSelection: EuiTableSelectionType<ServiceListItem> = {
    selectable: (item: ServiceListItem) => true,
    selectableMessage: (selectable: boolean, item: ServiceListItem) =>
      !selectable
        ? `Source code of ${item.serviceName} was not detected.`
        : `Detect bad smell for ${item.serviceName}`,
    onSelectionChange: (selectedItems: ServiceListItem[]) => {
      setServiceSelectedItems(selectedItems);
      console.log(selectedItems);
      console.log("------------------------------");
    },
  };
  //bad smells
  const [BSDebouncedSearchQuery, setBSDebouncedSearchQuery] = useStateDebounced('');
  const [renderedBSCurItems, setRenderedBSCurItems] = useState<BadSmellListItem[]>([]);


  const { services } = useKibana<BSDPluginStartDeps>();
  const { http } = services;
  const initialBSTableSortField = BadSmellDetectionFieldName.BadSmellName;
  const initialBStableSortDirection = 'desc';
  const sortBSFn: SortFunction<BadSmellListItem> = useCallback(
    (itemsToSort, sortField, sortDirection) => {
      return orderBadSmellItems({
        items: itemsToSort,
        primarySortField: sortField,
        sortDirection
      });
    }, []
  );
  const [renderedBSItems, setRenderedBSItems] = useState<BadSmellListItem[]>([]);

  const [isLoading, setLoading] = useState<FETCH_STATUS>(FETCH_STATUS.LOADING);
  const [detectable, setDetectable] = useState<Boolean>(true);
  const getBSDataByStatus = async () => {
    try {
      setLoading(FETCH_STATUS.LOADING)
      const response = await http?.get(`/api/bsd/bs_by_status/${detectable}`);
      const badSmellArr = response.BSSet;
      const convertedItems = badSmellArr.map(item=>({
        badSmellName: item.name,
        secondaryCategory: item.typeName,
        detectable: item.detectable,
        detectMethod: item.detectMethod,
        activeStatus: item.detectable,
      }));
      console.log("detectable bad smell", convertedItems);
      setRenderedBSItems(convertedItems);
      setLoading(FETCH_STATUS.SUCCESS);
    } catch (e: any) {
      setLoading(FETCH_STATUS.FAILURE);
      const errorMsg = e.response?.status
        ? `${e.response.status} ${e.message}`
        : e.message || 'Unknown error';
      console.error('Error fetching BS by BS type:', errorMsg);
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        await getBSDataByStatus();
      } catch (e) {
        console.error('Error fetching data:', e);
      }
    };
    fetchData();
  },[detectable]);

  const noBSItemsMessage = useMemo(() => {
    return (
      <EuiEmptyPrompt
        title={
          <div>
            No Bad Smells Found
          </div>
        }
        titleSize="s"
      />
    );
  }, []);
  const [badSmellSelectedItems, setBadSmellSelectedItems] = useState<BadSmellListItem[]>([]);


  useDeepCompareEffect(()=>{
    console.log("99999999999999999999");
    console.log(renderedBSCurItems);
  },[renderedBSCurItems]);

  const badSmellSelection: EuiTableSelectionType<BadSmellListItem> = {
    selectable: (item: BadSmellListItem) => !!(item.detectable && item.activeStatus),
    selectableMessage: (selectable: boolean, item: BadSmellListItem) =>
      !selectable
        ? `No detection method provided.`
        : `Detect bad smell of ${item.badSmellName}`,
    onSelectionChange: (selectedItems: BadSmellListItem[]) => {
        setBadSmellSelectedItems(selectedItems);
        console.log(selectedItems);
        console.log("------------------------------");
      },
  };
  


  //start detection 
  
  const backendPoints = localStorage.getItem(DETECTION_URL_KEY);

  // url, service name, bad smell name
  const [URLArr, setURLArr] = useState<[string, string, string][]>([]);
  useEffect(()=>{
    const newURLArr: [string, string, string][] = [];

    serviceSelectedItems.forEach((service) => {
      badSmellSelectedItems.forEach((badSmell) => {
        newURLArr.push([backendPoints + "/" + "overall" + "/" + dealWithBadSmellName(badSmell.badSmellName), service.serviceName, badSmell.badSmellName]); 
      });
    });

    setURLArr(newURLArr);

  },[serviceSelectedItems,badSmellSelectedItems]);

  useEffect(()=>{
    console.log("-------------------------------------------------");
    console.log(URLArr);
  },[URLArr]);

  const onClickToStartDetection = () =>{
    console.log("start detection in overall ui");
    
    //send request to detection  server
    sendRequests();
    
  }

  const sendRequests = async () => {

    const uuid = generateUUIDv4();

    try{
      
      const promises = URLArr.map((requestURL) => fetch(requestURL[0],{
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          serviceName:requestURL[1],
          detectionID:uuid
        }),
      }).then((response)=> {
        if(response.ok){
          setToasts((prevToasts) => [
          ...prevToasts,
          {
            id: uuid, 
            title: 'Command reached!',
            color: 'success',
            iconType: 'user',
            text: 'Detection command for '+ requestURL[1] + ' with ' + requestURL[2]+' issued.',
            toastLifeTimeMs: 5000
          },
        ]);
        }
        else{
          setToasts((prevToasts) => [
            ...prevToasts,
            {
              id: uuid, 
              title: 'Command error!',
              color: 'danger',
              iconType: 'help',
              text: 'Detection command for '+ requestURL[1] + ' with ' + requestURL[2]+' issued.',
              toastLifeTimeMs: 5000
            },
          ]);
        }
        
      }));
      await Promise.all(promises);
  
    }catch(error){
      console.error("Error sending requests:", error);
    }
    

  };

  const dealWithBadSmellName = (name:string) =>{
    return name.replace(/[^a-zA-Z0-9]/g,'-').toLowerCase();
  }




  // result toast 
  const [toasts, setToasts] = useState<EuiGlobalToastListToast[]>([]);

  const removeToast = () => {
    setToasts([]);

  };

  return (
    <>
    <EuiFlexGroup direction='column' gutterSize='m'>
      <EuiFlexGroup justifyContent="spaceBetween">
        <EuiFlexItem grow={5}>
          <EuiTextColor color="success">
            Detect all micorservices with all detectable bad smell. If no running microservices, dynamic detection will prompt a meaasge indicating that specific detection not performed.
          </EuiTextColor>
        </EuiFlexItem>
        <EuiFlexItem grow={5}>
          <DetectStats
            ServiceTitle='Services'
            BSTitle='Bad Smells'
            ServiceNum={renderedItems.length}
            ServiceDNum={renderedItems.filter(item=>item.detectable).length}
            BSNum={renderedBSCurItems.length}
            BSDNum={renderedBSCurItems.filter(item=>item.detectable).length}
            />
          <EuiSpacer size='m'/>

        </EuiFlexItem>
        <EuiFlexItem grow={false}>
              <EuiButton onClick={onClickToStartDetection}>
                  Start Detection
              </EuiButton>
          </EuiFlexItem>
      </EuiFlexGroup>
      <EuiSpacer size='m'/>
    <EuiFlexGroup direction="row" gutterSize='m'>

      <EuiFlexItem grow={false}>
      <EuiPanel>
        <SearchBar searchBarPlaceholder='search service by name(support KQL)'
          />
          <EuiSpacer size='xs'/>
        <DetectionServiceList
              status={mainStatisticsStatus}
              items={mainStatisticsData.items}
              initialSortField={initialSortField}
              initialSortDirection={initialSortDirection}
              sortFn={sortFn}
              noItemsMessage={noItemsMessage}
              initialPageSize={INITIAL_PAGE_SIZE}
              serviceOverflowCount={serviceOverflowCount}
              onChangeSearchQuery={setDebouncedSearchQuery}
              maxCountExceeded={mainStatisticsData?.maxCountExceeded ?? false}
              onChangeRenderedItems={setRenderedItems}
              isTableSearchBarEnabled={false}
              itemId="serviceName"
              selection={serviceSelection}
              dynamicOption={false}
            />
      </EuiPanel>

      </EuiFlexItem>

      <EuiFlexItem grow={false}>
      <EuiPanel>
      <DetectionBadSmellList
              status={isLoading}
              items={renderedBSItems}
              initialSortField={initialBSTableSortField}
              initialSortDirection={initialBStableSortDirection}
              sortFn={sortBSFn}
              noItemsMessage={noBSItemsMessage}
              initialPageSize={INITIAL_BS_PAGE_SIZE}
              onChangeSearchQuery={setBSDebouncedSearchQuery}
              maxCountExceeded={false}
              onChangeRenderedItems={setRenderedBSCurItems}
              isTableSearchBarEnabled={true}
              itemId="badSmellName"
              selection={badSmellSelection}
              dynamicOption={false}
            />
      </EuiPanel>
      </EuiFlexItem>

      <EuiFlexItem>
        <EuiGlobalToastList
          toasts={toasts}
          dismissToast={removeToast}
          toastLifeTimeMs={5000}
        />
      </EuiFlexItem>
    </EuiFlexGroup>

    
    </EuiFlexGroup>

   
  </>
  );
}

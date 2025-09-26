import { EuiButton, EuiDescribedFormGroup, EuiEmptyPrompt, EuiFieldNumber, EuiFlexGroup, EuiFlexItem, EuiForm, EuiFormRow, EuiGlobalToastList, EuiGlobalToastListToast, EuiPanel, EuiProgress, EuiSpacer, EuiSwitch, EuiTableSelectionType, EuiText, EuiTextColor } from '@elastic/eui';
import React, { useCallback, useEffect, useMemo, useState } from 'react';

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
import { BadSmellListItem } from '../../../../../common/interfaces/interfaces';
import { generateUUIDv4 } from '../../../../../common/utils/get_uuid';

export function DynamicPageView() {

  //num in DetectStats
  const [badSmellNumMax,setBadSmellNumMax] = useState(0);
  const [badSmellDetectableMax,setBadSmellDetectableMax] = useState(0);
  //services
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useStateDebounced('');
  const [renderedItems, setRenderedItems] = useState<ServiceListItem[]>([]);

  const mainStatisticsFetch = useServicesMainStatisticsFetcher(debouncedSearchQuery,true);
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
            No Running Microservices Found.
          </div>
        }
        titleSize="s"
      />
    );
  }, []);
  const serviceOverflowCount = mainStatisticsData?.serviceOverflowCount ?? 0;
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

  const {
    query: { detectMethod },
  } = useBSDParams('/detect/dynamic');
  const [isLoading, setLoading] = useState<FETCH_STATUS>(FETCH_STATUS.LOADING);
  const getBSDataByType = async () => {
    try {
      setLoading(FETCH_STATUS.LOADING)
      const response = await http?.get(`/api/bsd/bs_by_detct_way/${detectMethod}`);
      const badSmellArr = response.BSSet;
       const convertedItems = badSmellArr.map(item=>({
        badSmellName: item.name,
        primaryCategory: item.categoryName,
        secondaryCategory: item.typeName,
        detectable: item.detectable,
        detectMethod: item.detectMethod,
        activeStatus: item.realized,
      }));
      setRenderedBSItems(convertedItems);
      setBadSmellNumMax(convertedItems.length);
      setBadSmellDetectableMax(convertedItems.filter(item=>item.detectable).length);
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
        await getBSDataByType();
      } catch (e) {
        console.error('Error fetching data:', e);
      }
    };
    fetchData();
  },[]);
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

  // set interval
const [intervalValue, setIntervalValue] = useState<number>(1);
const onIntervalChange = (e:any) => {
  setIntervalValue(e.target.value);
};
const [checked, setChecked] = useState(false);
const onSwitchChange = (e:any) => {
  setChecked(e.target.checked);
};

//service slelecion
  const [serviceSelectedItems, setServiceSelectedItems] = useState<ServiceListItem[]>([]);
  const [badSmellSelectedItems, setBadSmellSelectedItems] = useState<BadSmellListItem[]>([]);

  const serviceSelection: EuiTableSelectionType<ServiceListItem> = {
    selectable: (item: ServiceListItem) => true,
    selectableMessage: (selectable: boolean, item: ServiceListItem) =>
      !selectable
        ? `Please ensure ${item.serviceName} is running not detected.`
        : `Detect bad smell for ${item.serviceName}`,
    onSelectionChange: (selectedItems: ServiceListItem[]) => {
      setServiceSelectedItems(selectedItems);
      console.log(selectedItems);
      console.log("------------------------------");
    },
  };


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

  //dynamic detection 



  const backendPoints = localStorage.getItem(DETECTION_URL_KEY);
  const [URLArr, setURLArr] = useState<[string, string, string][]>([]);
  useEffect(()=>{
    const newURLArr: [string, string, string][] = [];

    serviceSelectedItems.forEach((service) => {
      badSmellSelectedItems.forEach((badSmell) => {
        newURLArr.push([backendPoints + "/" + getBadSmellPrefixByName("Dynamic") + "/" + dealWithBadSmellName(badSmell.badSmellName), service.serviceName, badSmell.badSmellName]); 
      });
    });

    setURLArr(newURLArr);

  },[serviceSelectedItems,badSmellSelectedItems]);
  //dynamic detection button
  const isButtonDisabled = serviceSelectedItems.length === 0 || badSmellSelectedItems.length === 0;
  const tooltipContent = "Please ensure that both service and bad smell items are selected before starting detection.";
  const onClickToStartDetection = () =>{
    console.log("start detection with dynamic method");
    
    //send request to detection  server
    sendRequests();
    
  }
  const dealWithBadSmellName = (name:string) =>{
    return name.replace(/[^a-zA-Z0-9+]/g,'-').toLowerCase();
  }

  const [toasts, setToasts] = useState<EuiGlobalToastListToast[]>([]);

  const removeToast = () => {
    setToasts([]);

  };

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

  return (
    <>
    <EuiFlexGroup direction='column' gutterSize='m'>
      <EuiFlexGroup justifyContent="spaceBetween">
        <EuiFlexItem grow={3}>
          <EuiTextColor color="success">
            Detection some runtime bad smells.
          </EuiTextColor>
        </EuiFlexItem>
        <EuiFlexItem grow={5}>
          <DetectStats
            RunningServiceTitle='Running Services'
            BSTitle='Runtime Bad Smells'
            RunningServiceNum={renderedItems.length}
            BSNum={badSmellNumMax}
            BSDNum={badSmellDetectableMax}
            />
          <EuiSpacer size='m'/>

        </EuiFlexItem>
      </EuiFlexGroup>
      <EuiSpacer size='xs'/>
      <EuiFlexGroup direction="column" gutterSize='m' justifyContent='flexStart' style={{width:'70%'}}>

        <EuiFlexItem grow={false}>
            <EuiPanel>
              <EuiSwitch
                    label="Set Default Configuration"
                    onChange={(e) => onSwitchChange(e)} checked={checked} 
              />
              <EuiFlexGroup direction="column">
                  <EuiFlexItem grow={false}>
                    <EuiForm component="form">
                        <EuiDescribedFormGroup
                        title={<h3>Override detault time interval</h3>}
                        description={
                            <p>
                            This property desides the time interval of data collector to get runtime data from APM.
                            </p>
                        }
                        >
                        <EuiFormRow label="Time Interal(unit: minute)">
                            <EuiFieldNumber
                            defaultValue={5}
                            min={1}
                            max={6}
                            step={1}
                            onChange={(e) => onIntervalChange(e)}
                            readOnly={!checked}
                            />
                        </EuiFormRow>
                        </EuiDescribedFormGroup>
                    </EuiForm>
                  </EuiFlexItem>
              </EuiFlexGroup>
              </EuiPanel>
        </EuiFlexItem>

        <EuiFlexItem grow={false}>
            <EuiPanel>
              <EuiText textAlign='left' style={{ fontWeight:'bold'}}>
                <h3>Detectable Running Microservices</h3>
              </EuiText>
              <EuiSpacer size="s"/>
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
                    dynamicOption={true}
                    itemId="serviceName"
                    selection={serviceSelection}
                  />
            </EuiPanel>
        </EuiFlexItem>
      </EuiFlexGroup>

      <EuiFlexItem grow={false}>
        <EuiPanel>
          <EuiFlexGroup direction='row' justifyContent='spaceBetween'>
            <EuiFlexItem grow={3}>
              <EuiText textAlign='left' style={{ fontWeight:'bold'}}>
                  <h3>Runtime Bad Smells</h3>
          </EuiText>
            </EuiFlexItem>
            <EuiFlexItem grow={1}>
              <EuiButton 
                        onClick={onClickToStartDetection} 
                        isDisabled={isButtonDisabled} 
                        title={tooltipContent}
                        >
                  Start Detection
              </EuiButton>
            </EuiFlexItem>
          </EuiFlexGroup>
          
          
          <EuiSpacer size="s"/>

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
                  dynamicOption={true}
                  runningServiceNum={renderedItems?renderedItems.length:0}
                  itemId="badSmellName"
                  selection={badSmellSelection}
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
  </>
  );
}

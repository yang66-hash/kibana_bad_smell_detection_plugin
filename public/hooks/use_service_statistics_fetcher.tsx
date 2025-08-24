import { ApmDocumentType } from "../../common/document_type";
import { APIReturnType } from "../services/rest/create_call_bsd_api";
import { useBSDParams } from "./use_bsd_params";
import { usePreferredDataSourceAndBucketSize } from "./use_preferred_data_source_and_bucket_size";
import { useProgressiveFetcher } from "./use_progressive_fetcher";
import { useTimeRange } from "./use_time_range";
import { v4 as uuidv4 } from 'uuid';

type ServiceStatisticsApiResponse = APIReturnType<'GET /internal/apm/services'>;

export const INITIAL_PAGE_SIZE = 25;
export const INITIAL_DATA: ServiceStatisticsApiResponse & { requestId: string } = {
    requestId: '',
    items: [],
    serviceOverflowCount: 0,
    maxCountExceeded: false,
  };


export function useServicesMainStatisticsFetcher(searchQuery: string | undefined, isDynamicFetch?:boolean) {
    const {
      query: {
        rangeFrom,
        rangeTo,
        environment,
        kuery,
        serviceGroup,
        page = 0,
        pageSize = INITIAL_PAGE_SIZE,
        sortDirection,
        sortField,
      },
    } = useBSDParams('/detect');
  
    const constantTimeRange = {rangeFrom:'now-1m',rangeTo:'now'};
    const { start, end } = useTimeRange(isDynamicFetch?constantTimeRange:{ rangeFrom, rangeTo });
  
    const preferred = usePreferredDataSourceAndBucketSize({
      start,
      end,
      kuery,
      type: ApmDocumentType.ServiceTransactionMetric,
      numBuckets: 20,
    });
  
    const shouldUseDurationSummary = !!preferred?.source?.hasDurationSummaryField;
  
    const { data = INITIAL_DATA, status } = useProgressiveFetcher(
      (callBSDApi) => {
        if (preferred) {
          return callBSDApi('GET /internal/apm/services', {
            params: {
              query: {
                environment,
                kuery,
                start,
                end,
                serviceGroup,
                useDurationSummary: shouldUseDurationSummary,
                documentType: preferred.source.documentType,
                rollupInterval: preferred.source.rollupInterval,
                searchQuery,
              },
            },
          }).then((mainStatisticsData) => {
            return {
              requestId: uuidv4(),
              ...mainStatisticsData,
            };
          });
        }
      },
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [
        environment,
        kuery,
        start,
        end,
        serviceGroup,
        preferred,
        searchQuery,
        // not used, but needed to update the requestId to call the details statistics API when table options are updated
        page,
        pageSize,
        sortField,
        sortDirection,
      ]
    );
  
    return { mainStatisticsData: data, mainStatisticsStatus: status };
  }
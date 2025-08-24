import { ApmDocumentType } from "../../common/document_type";
import { ServiceListItem } from "../../common/service_inventory";
import { isTimeComparison } from "../components/shared/time_comparison/get_comparison_options";
import { useBSDParams } from "./use_bsd_params";
import { FETCH_STATUS } from "./use_fetcher";
import { usePreferredDataSourceAndBucketSize } from "./use_preferred_data_source_and_bucket_size";
import { useProgressiveFetcher } from "./use_progressive_fetcher";
import { useServicesMainStatisticsFetcher } from "./use_service_statistics_fetcher";
import { useTimeRange } from "./use_time_range";


export function useServicesDetailedStatisticsFetcher({
    mainStatisticsFetch,
    renderedItems,
  }: {
    mainStatisticsFetch: ReturnType<typeof useServicesMainStatisticsFetcher>;
    renderedItems: ServiceListItem[];
  }) {
    const {
      query: { rangeFrom, rangeTo, environment, kuery, offset, comparisonEnabled },
    } = useBSDParams('/detect');
  
    const { start, end } = useTimeRange({ rangeFrom, rangeTo });
  
    const dataSourceOptions = usePreferredDataSourceAndBucketSize({
      start,
      end,
      kuery,
      type: ApmDocumentType.ServiceTransactionMetric,
      numBuckets: 20,
    });
  
    const { mainStatisticsData, mainStatisticsStatus } = mainStatisticsFetch;
  
    const comparisonFetch = useProgressiveFetcher(
      (callBSDApi) => {
        const serviceNames = renderedItems.map(({ serviceName }) => serviceName);
  
        if (
          start &&
          end &&
          serviceNames.length > 0 &&
          mainStatisticsStatus === FETCH_STATUS.SUCCESS &&
          dataSourceOptions
        ) {
          return callBSDApi('POST /internal/apm/services/detailed_statistics', {
            params: {
              query: {
                environment,
                kuery,
                start,
                end,
                offset: comparisonEnabled && isTimeComparison(offset) ? offset : undefined,
                documentType: dataSourceOptions.source.documentType,
                rollupInterval: dataSourceOptions.source.rollupInterval,
                bucketSizeInSeconds: dataSourceOptions.bucketSizeInSeconds,
              },
              body: {
                // Service name is sorted to guarantee the same order every time this API is called so the result can be cached.
                serviceNames: JSON.stringify(serviceNames.sort()),
              },
            },
          });
        }
      },
      [mainStatisticsData.requestId, renderedItems, offset, comparisonEnabled],
      { preservePreviousData: false }
    );
  
    return { comparisonFetch };
  }
import { useFetcher } from './use_fetcher';

export interface RequestChainNode {
  serviceName: string;
  containSQL: boolean;
  sqlModelList?: Array<{
    instance: string;
    statement: string;
    dbType: string;
    dbFurType: string;
    execTime: number;
    dataQueryNum: number;
  }>;
  subNodes: RequestChainNode[];
  apiname: string;
}

export interface RequestChainData {
  traceId: string;
  sourceSvc: string;
  targetSvcNumMap: Record<string, number>;
  chain: RequestChainNode;
  apiname: string;
}

export interface RequestChainResponse {
  found: boolean;
  requestChain: RequestChainData | null;
  metadata?: {
    startTime: string;
    endTime: string;
    serviceName: string;
    language: string;
    podName: string;
    collector: string;
    chainDepth: number;
    sqlCount: number;
    totalExecTime: number;
  };
}

export function useRequestChainFetcher(traceId?: string) {
  const { data, status, error } = useFetcher(
    (callBsdApi) => {
      if (!traceId) {
        return Promise.resolve(undefined);
      }

      return callBsdApi(`GET /internal/bsd/request_chain/{traceId}` as any, {
        params: {
          path: { traceId },
        },
      });
    },
    [traceId]
  );

  return {
    requestChainData: data as RequestChainResponse | undefined,
    status,
    error,
  };
} 
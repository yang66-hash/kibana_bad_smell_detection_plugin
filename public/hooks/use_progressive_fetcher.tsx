/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
import type { OmitByValue, Assign } from 'utility-types';
import type { ClientRequestParamsOf, EndpointOf, ReturnOf } from '@kbn/server-route-repository';
import { useKibana } from '@kbn/kibana-react-plugin/public';
import {
  apmProgressiveLoading,
  getProbabilityFromProgressiveLoadingQuality,
  ProgressiveLoadingQuality,
} from '@kbn/observability-plugin/common';
import type { BSDServerRouteRepository } from '../../server';

import type { BSDClient, BSDClientOptions } from '../services/rest/create_call_bsd_api';
import { FetcherResult, FETCH_STATUS, useFetcher } from './use_fetcher';

type APMProgressivelyLoadingServerRouteRepository = OmitByValue<
  {
    [key in keyof BSDServerRouteRepository]: ClientRequestParamsOf<
      BSDServerRouteRepository,
      key
    > extends {
      params: { query: { probability: any } };
    }
      ? BSDServerRouteRepository[key]
      : undefined;
  },
  undefined
>;

type WithoutProbabilityParameter<T extends Record<string, any>> = {
  params: { query: {} };
} & Assign<
  T,
  {
    params: Omit<T['params'], 'query'> & {
      query: Omit<T['params']['query'], 'probability'>;
    };
  }
>;

type APMProgressiveAPIClient = <
  TEndpoint extends EndpointOf<APMProgressivelyLoadingServerRouteRepository>
>(
  endpoint: TEndpoint,
  options: Omit<BSDClientOptions, 'signal'> &
    WithoutProbabilityParameter<
      ClientRequestParamsOf<APMProgressivelyLoadingServerRouteRepository, TEndpoint>
    >
) => Promise<ReturnOf<APMProgressivelyLoadingServerRouteRepository, TEndpoint>>;

function clientWithProbability(regularCallBSDApi: BSDClient, probability: number) {
  return <TEndpoint extends EndpointOf<APMProgressivelyLoadingServerRouteRepository>>(
    endpoint: TEndpoint,
    options: Omit<BSDClientOptions, 'signal'> &
      WithoutProbabilityParameter<
        ClientRequestParamsOf<APMProgressivelyLoadingServerRouteRepository, TEndpoint>
      >
  ) => {
    return regularCallBSDApi(endpoint, {
      ...options,
      params: {
        ...options.params,
        query: {
          ...options.params.query,
          probability,
        },
      },
    } as any);
  };
}

//
export function useProgressiveFetcher<TReturn>(
  callback: (callBSDApi: APMProgressiveAPIClient) => Promise<TReturn> | undefined,
  dependencies: any[],
  options?: Parameters<typeof useFetcher>[2]
): FetcherResult<TReturn> {
  const {
    services: { uiSettings },
  } = useKibana();

  const progressiveLoadingQuality =
    uiSettings?.get<ProgressiveLoadingQuality>(apmProgressiveLoading) ??
    ProgressiveLoadingQuality.off;

  const sampledProbability = getProbabilityFromProgressiveLoadingQuality(progressiveLoadingQuality);

  const sampledFetch = useFetcher(
    (regularCallBSDApi) => {
      if (progressiveLoadingQuality === ProgressiveLoadingQuality.off) {
        return;
      }
      return callback(clientWithProbability(regularCallBSDApi, sampledProbability));
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    dependencies,
    options
  );

  const unsampledFetch = useFetcher(
    (regularCallBSDApi) => {
      return callback(clientWithProbability(regularCallBSDApi, 1));
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    dependencies
  );

  const fetches = [unsampledFetch, sampledFetch];

  const isError = unsampledFetch.status === FETCH_STATUS.FAILURE;

  const usedFetch =
    (!isError && fetches.find((fetch) => fetch.status === FETCH_STATUS.SUCCESS)) || unsampledFetch;

  const status =
    unsampledFetch.status === FETCH_STATUS.LOADING && usedFetch.status === FETCH_STATUS.SUCCESS
      ? FETCH_STATUS.LOADING
      : usedFetch.status;

  return {
    ...usedFetch,
    status,
  };
}

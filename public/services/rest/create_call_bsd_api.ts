/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { CoreSetup, CoreStart } from '@kbn/core/public';
import type {
  ClientRequestParamsOf,
  ReturnOf,
  RouteRepositoryClient,
  ServerRouteRepository,
} from '@kbn/server-route-repository';
import { formatRequest } from '@kbn/server-route-repository';
import { InspectResponse } from '@kbn/observability-plugin/typings/common';
import { FetchOptions } from '../../../common/fetch_options';
import { CallApi, callApi } from './call_api';
import type { BSDServerRouteRepository, APIEndpoint } from '../../../server';

export type BSDClientOptions = Omit<FetchOptions, 'query' | 'body' | 'pathname' | 'signal'> & {
  signal: AbortSignal | null;
};

export type BSDClient = RouteRepositoryClient<BSDServerRouteRepository, BSDClientOptions>;

export type AutoAbortedBSDClient = RouteRepositoryClient<
  BSDServerRouteRepository,
  Omit<BSDClientOptions, 'signal'>
>;

export type APIReturnType<TEndpoint extends APIEndpoint> = ReturnOf<
  BSDServerRouteRepository,
  TEndpoint
> & {
  _inspect?: InspectResponse;
};

export type APIClientRequestParamsOf<TEndpoint extends APIEndpoint> = ClientRequestParamsOf<
  BSDServerRouteRepository,
  TEndpoint
>;

export type AbstractBSDRepository = ServerRouteRepository;

export type AbstractBSDClient = RouteRepositoryClient<AbstractBSDRepository, BSDClientOptions>;

export let callBSDApi: BSDClient = () => {
  throw new Error('callBSDApi has to be initialized before used. Call createCallBSDApi first.');
};

export function createCallBSDApi(core: CoreStart | CoreSetup) {
  callBSDApi = ((endpoint, options) => {
    const { params } = options as unknown as {
      params?: Partial<Record<string, any>>;
    };

    const { method, pathname, version } = formatRequest(endpoint, params?.path);

    return callApi(core, {
      ...options,
      method,
      pathname,
      body: params?.body,
      query: params?.query,
      version,
    } as unknown as Parameters<CallApi>[1]);
  }) as BSDClient;
}

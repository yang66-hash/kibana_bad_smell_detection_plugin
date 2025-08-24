/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
import { once } from 'lodash';
import { createCallBSDApi, callBSDApi } from './create_call_bsd_api';
import type {
  AbstractBSDClient,
  APIClientRequestParamsOf,
  APIReturnType,
} from './create_call_bsd_api';
import { type APIEndpoint } from '../../../server';

const spyObj = { createCallBSDApi, callBSDApi };

export type CallBSDApiSpy = jest.SpyInstance<Promise<any>, Parameters<AbstractBSDClient>>;

export type CreateCallBSDApiSpy = jest.SpyInstance<AbstractBSDClient>;

export const getCallBSDApiSpy = () => jest.spyOn(spyObj, 'callBSDApi') as unknown as CallBSDApiSpy;

type MockBSDApiCall = <TEndpoint extends APIEndpoint>(
  endpoint: TEndpoint,
  fn: (params: APIClientRequestParamsOf<TEndpoint>) => APIReturnType<TEndpoint>
) => void;

const getSpy = once(() => {
  const spy = getCallBSDApiSpy();

  const cache: Record<string, Function> = {};

  const response: MockBSDApiCall = (endpoint, fn) => {
    cache[endpoint] = fn;
  };

  spy.mockImplementation((endpoint, params) => {
    const fn = cache[endpoint];

    if (fn) {
      return Promise.resolve(fn(params));
    }

    throw new Error('No cached response defined for ' + endpoint);
  });

  return {
    response,
  };
});

export const mockBSDApiCallResponse: MockBSDApiCall = (...args) => {
  getSpy().response(...args);
};

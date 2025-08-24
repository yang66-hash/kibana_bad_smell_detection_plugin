/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { useMemo } from 'react';

import { useBSDServiceContext } from '../../../context/bsd_service/use_bsd_service_context';

import { useAnyOfBSDParams } from '../../../hooks/use_bsd_params';
import { useTimeRange } from '../../../hooks/use_time_range';

export const useFetchParams = () => {
  const { serviceName } = useBSDServiceContext();

  const {
    query: { kuery, environment, rangeFrom, rangeTo, transactionName, transactionType },
  } = useAnyOfBSDParams(
    '/services/{serviceName}/transactions/view',
    '/mobile-services/{serviceName}/transactions/view'
  );

  const { start, end } = useTimeRange({ rangeFrom, rangeTo });

  return useMemo(
    () => ({
      serviceName,
      transactionName,
      transactionType,
      kuery,
      environment,
      start,
      end,
    }),
    [serviceName, transactionName, transactionType, kuery, environment, start, end]
  );
};

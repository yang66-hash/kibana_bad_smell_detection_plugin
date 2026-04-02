/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { EuiSpacer, EuiTitle } from '@elastic/eui';
import React from 'react';
import { useHistory } from 'react-router-dom';
import { useBSDServiceContext } from '../../../context/bsd_service/use_bsd_service_context';
import { useBreadcrumb } from '../../../context/breadcrumbs/use_breadcrumb';
import { useAnyOfBSDParams } from '../../../hooks/use_bsd_params';
import { useBSDRouter } from '../../../hooks/use_bsd_router';
import { useTimeRange } from '../../../hooks/use_time_range';

import { replace } from '../../shared/links/url_helpers';
import { TransactionDetailsTabs } from './transaction_details_tabs';
import { isServerlessAgentName } from '../../../../common/agent_name';
import { useLocalStorage } from '../../../hooks/use_local_storage';

export function TransactionDetails() {
  const { path, query } = useAnyOfBSDParams(
    '/services/{serviceName}/transactions/view'  );
  const {
    transactionName,
    rangeFrom,
    rangeTo,
    transactionType: transactionTypeFromUrl,
    comparisonEnabled,
    offset,
    environment,
  } = query;
  const apmRouter = useBSDRouter();
  const { transactionType, serverlessType, serviceName } =
    useBSDServiceContext();

  const history = useHistory();

  // redirect to first transaction type
  if (!transactionTypeFromUrl && transactionType) {
    replace(history, { query: { transactionType } });
  }

  useBreadcrumb(
    () => ({
      title: transactionName,
      href: apmRouter.link('/services/{serviceName}/transactions/view', {
        path,
        query,
      }),
    }),
    [apmRouter, path, query, transactionName]
  );

  const isServerless = isServerlessAgentName(serverlessType);
  const [sloCalloutDismissed, setSloCalloutDismissed] = useLocalStorage(
    'apm.sloCalloutDismissed',
    false
  );

  return (
    <>
     

      <EuiTitle>
        <h2>{transactionName}</h2>
      </EuiTitle>
      <EuiSpacer size="m" />

      <TransactionDetailsTabs />
    </>
  );
}

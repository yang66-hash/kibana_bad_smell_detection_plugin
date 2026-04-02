/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import React from 'react';

import { i18n } from '@kbn/i18n';

import { METRIC_TYPE, useTrackMetric } from '@kbn/observability-shared-plugin/public';

import { FailedTransactionsCorrelations } from '../correlations/failed_transactions_correlations';
import { TabContentProps } from './transaction_details_tabs';

function FailedTransactionsCorrelationsTab({ onFilter }: TabContentProps) {


  const metric = {
    app: 'apm' as const,
    metric: 'failed_transactions_tab_view',
    metricType: METRIC_TYPE.COUNT as METRIC_TYPE.COUNT,
  };
  useTrackMetric(metric);
  useTrackMetric({ ...metric, delay: 15000 });

  return (
    <FailedTransactionsCorrelations onFilter={onFilter} />
  );

}

export const failedTransactionsCorrelationsTab = {
  dataTestSubj: 'apmFailedTransactionsCorrelationsTabButton',
  key: 'failedTransactionsCorrelations',
  label: (
    <>
      {i18n.translate('xpack.apm.transactionDetails.tabs.failedTransactionsCorrelationsLabel', {
        defaultMessage: 'Failed transaction correlations',
      })}
    </>
  ),
  component: FailedTransactionsCorrelationsTab,
};

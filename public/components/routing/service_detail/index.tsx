/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
import { i18n } from '@kbn/i18n';
import { toBooleanRt, toNumberRt } from '@kbn/io-ts-utils';
import { ALERT_STATUS_ACTIVE, ALERT_STATUS_RECOVERED } from '@kbn/rule-data-utils';
import { Outlet } from '@kbn/typed-react-router-config';
import * as t from 'io-ts';
import qs from 'query-string';
import React from 'react';
import { Redirect } from 'react-router-dom';
import { offsetRt } from '../../../../common/comparison_rt';
import { ENVIRONMENT_ALL } from '../../../../common/environment_filter_values';
import { environmentRt } from '../../../../common/environment_rt';
import { LatencyAggregationType } from '../../../../common/latency_aggregation_types';
import { ApmTimeRangeMetadataContextProvider } from '../../../context/time_range_metadata/time_range_metadata_context';
import { useBSDParams } from '../../../hooks/use_bsd_params';

import { ServiceOverview } from '../../app/service_overview';
import { TransactionDetails } from '../../app/transaction_details';
import { TransactionOverview } from '../../app/transaction_overview';
import { ApmServiceTemplate } from '../templates/apm_service_template';
import { ApmServiceWrapper } from './apm_service_wrapper';
import { RedirectToDefaultServiceRouteView } from './redirect_to_default_service_route_view';
import { ProfilingOverview } from '../../app/profiling_overview';
import { SearchBar } from '../../shared/search_bar/search_bar';
import { ServiceDashboards } from '../../app/service_dashboards';

function page({
  title,
  tab,
  element,
  searchBarOptions,
}: {
  title: string;
  tab: React.ComponentProps<typeof ApmServiceTemplate>['selectedTab'];
  element: React.ReactElement<any, any>;
  searchBarOptions?: React.ComponentProps<typeof SearchBar>;
}): {
  element: React.ReactElement<any, any>;
} {
  return {
    element: (
      <ApmServiceTemplate title={title} selectedTab={tab} searchBarOptions={searchBarOptions}>
        {element}
      </ApmServiceTemplate>
    ),
  };
}

function RedirectNodesToMetrics() {
  const { query, path } = useBSDParams('/services/{serviceName}/nodes');
  const search = qs.stringify(query);
  return <Redirect to={{ pathname: `/services/${path.serviceName}/metrics`, search }} />;
}

function RedirectNodeMetricsToMetricsDetails() {
  const { query, path } = useBSDParams('/services/{serviceName}/nodes/{serviceNodeName}/metrics');
  const search = qs.stringify(query);
  return (
    <Redirect
      to={{
        pathname: `/services/${path.serviceName}/metrics/${path.serviceNodeName}`,
        search,
      }}
    />
  );
}

export const serviceDetailRoute = {
  '/services/{serviceName}': {
    element: (
      <ApmTimeRangeMetadataContextProvider>
        <ApmServiceWrapper />
      </ApmTimeRangeMetadataContextProvider>
    ),
    params: t.intersection([
      t.type({
        path: t.type({
          serviceName: t.string,
        }),
      }),
      t.type({
        query: t.intersection([
          environmentRt,
          t.type({
            rangeFrom: t.string,
            rangeTo: t.string,
            kuery: t.string,
            serviceGroup: t.string,
            comparisonEnabled: toBooleanRt,
          }),
          t.partial({
            latencyAggregationType: t.string,
            transactionType: t.string,
            refreshPaused: t.union([t.literal('true'), t.literal('false')]),
            refreshInterval: t.string,
          }),
          offsetRt,
        ]),
      }),
    ]),
    defaults: {
      query: {
        kuery: '',
        environment: ENVIRONMENT_ALL.value,
        serviceGroup: '',
        latencyAggregationType: LatencyAggregationType.avg,
      },
    },
    children: {
      '/services/{serviceName}/overview': {
        ...page({
          element: <ServiceOverview />,
          tab: 'overview',
          title: i18n.translate('xpack.apm.views.overview.title', {
            defaultMessage: 'BSD Overview',
          }),
          searchBarOptions: {
            showTransactionTypeSelector: true,
            showTimeComparison: true,
          },
        }),
        params: t.partial({
          query: t.partial({
            page: toNumberRt,
            pageSize: toNumberRt,
            sortField: t.string,
            sortDirection: t.union([t.literal('asc'), t.literal('desc')]),
          }),
        }),
      },
      '/services/{serviceName}/transactions': {
        ...page({
          tab: 'transactions',
          title: 'Transactions Overview',
          element: <Outlet />,
          searchBarOptions: {
            showTransactionTypeSelector: true,
            showTimeComparison: true,
          },
        }),
        params: t.partial({
          query: t.partial({
            page: toNumberRt,
            pageSize: toNumberRt,
            sortField: t.string,
            sortDirection: t.union([t.literal('asc'), t.literal('desc')]),
          }),
        }),
        children: {
          '/services/{serviceName}/transactions/view': {
            element: <TransactionDetails />,
            params: t.type({
              query: t.intersection([
                t.type({
                  transactionName: t.string,
                  comparisonEnabled: toBooleanRt,
                  showCriticalPath: toBooleanRt,
                }),
                t.partial({
                  traceId: t.string,
                  transactionId: t.string,
                  flyoutDetailTab: t.string,
                }),
                offsetRt,
              ]),
            }),
            defaults: {
              query: {
                showCriticalPath: '',
              },
            },
          },
          '/services/{serviceName}/transactions': {
            element: <TransactionOverview />,
          },
        },
      },
      '/services/{serviceName}/': {
        element: <RedirectToDefaultServiceRouteView />,
      },
    },
  },
};

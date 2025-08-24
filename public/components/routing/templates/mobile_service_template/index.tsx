/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { EuiFlexGroup, EuiFlexItem, EuiPageHeaderProps, EuiTitle } from '@elastic/eui';
import { i18n } from '@kbn/i18n';
import { omit } from 'lodash';
import React from 'react';
import { useBSDPluginContext } from '../../../../context/bsd_plugin/use_bsd_plugin_context';
import { ApmServiceContextProvider } from '../../../../context/bsd_service/bsd_service_context';
import { useBreadcrumb } from '../../../../context/breadcrumbs/use_breadcrumb';
import { ServiceAnomalyTimeseriesContextProvider } from '../../../../context/service_anomaly_timeseries/service_anomaly_timeseries_context';
import { useBSDParams } from '../../../../hooks/use_bsd_params';
import { useBSDRouter } from '../../../../hooks/use_bsd_router';
import { useTimeRange } from '../../../../hooks/use_time_range';
import { getAlertingCapabilities } from '../../../alerting/utils/get_alerting_capabilities';
import { MobileSearchBar } from '../../../app/mobile/search_bar';
import { ServiceIcons } from '../../../shared/service_icons';
import { TechnicalPreviewBadge } from '../../../shared/technical_preview_badge';
import { BSDMainTemplate } from '../bsd_main_template';
import { AnalyzeDataButton } from '../apm_service_template/analyze_data_button';

type Tab = NonNullable<EuiPageHeaderProps['tabs']>[0] & {
  key:
    | 'overview'
    | 'transactions'
    | 'dependencies'
    | 'errors-and-crashes'
    | 'service-map'
    | 'alerts'
    | 'dashboards';
  hidden?: boolean;
};

interface Props {
  title: string;
  children: React.ReactChild;
  selectedTabKey: Tab['key'];
  searchBarOptions?: React.ComponentProps<typeof MobileSearchBar>;
}

export function MobileServiceTemplate(props: Props) {
  return (
    <ApmServiceContextProvider>
      <TemplateWithContext {...props} />
    </ApmServiceContextProvider>
  );
}

function TemplateWithContext({ title, children, selectedTabKey, searchBarOptions }: Props) {
  const {
    path: { serviceName },
    query,
    query: { rangeFrom, rangeTo, environment },
  } = useBSDParams('/mobile-services/{serviceName}/*');

  const { start, end } = useTimeRange({ rangeFrom, rangeTo });

  const router = useBSDRouter();

  const tabs = useTabs({ selectedTabKey });
  const selectedTab = tabs?.find(({ isSelected }) => isSelected);

  const servicesLink = router.link('/services', {
    query: { ...query },
  });

  useBreadcrumb(
    () => [
      {
        title: i18n.translate('xpack.apm.mobileServices.breadcrumb.title', {
          defaultMessage: 'Services',
        }),
        href: servicesLink,
      },
      ...(selectedTab
        ? [
            {
              title: serviceName,
              href: router.link('/mobile-services/{serviceName}', {
                path: { serviceName },
                query,
              }),
            },
            {
              title: selectedTab.label,
              href: selectedTab.href,
            } as { title: string; href: string },
          ]
        : []),
    ],
    [query, router, selectedTab, serviceName, servicesLink]
  );

  return (
    <BSDMainTemplate
      pageHeader={{
        tabs,
        pageTitle: (
          <EuiFlexGroup justifyContent="spaceBetween">
            <EuiFlexItem>
              <EuiFlexGroup alignItems="center">
                <EuiFlexItem grow={false}>
                  <EuiTitle size="l">
                    <h1 data-test-subj="apmMainTemplateHeaderServiceName">{serviceName}</h1>
                  </EuiTitle>
                </EuiFlexItem>
                <EuiFlexItem grow={false}>
                  <ServiceIcons
                    serviceName={serviceName}
                    environment={environment}
                    start={start}
                    end={end}
                  />
                </EuiFlexItem>
              </EuiFlexGroup>
            </EuiFlexItem>

            <EuiFlexItem grow={false}>
              <AnalyzeDataButton />
            </EuiFlexItem>
          </EuiFlexGroup>
        ),
      }}
    >
      <MobileSearchBar {...searchBarOptions} />
      <ServiceAnomalyTimeseriesContextProvider>{children}</ServiceAnomalyTimeseriesContextProvider>
    </BSDMainTemplate>
  );
}

function useTabs({ selectedTabKey }: { selectedTabKey: Tab['key'] }) {
  const { core, plugins } = useBSDPluginContext();
  const { capabilities } = core.application;
  const { isAlertingAvailable, canReadAlerts } = getAlertingCapabilities(plugins, capabilities);

  const router = useBSDRouter();

  const {
    path: { serviceName },
    query: queryFromUrl,
  } = useBSDParams(`/mobile-services/{serviceName}/${selectedTabKey}` as const);

  const query = omit(queryFromUrl, 'page', 'pageSize', 'sortField', 'sortDirection');

  const tabs: Tab[] = [
    {
      key: 'overview',
      href: router.link('/mobile-services/{serviceName}/overview', {
        path: { serviceName },
        query,
      }),
      label: i18n.translate('xpack.apm.mobileServiceDetails.overviewTabLabel', {
        defaultMessage: 'Overview',
      }),
    },
    {
      key: 'transactions',
      href: router.link('/mobile-services/{serviceName}/transactions', {
        path: { serviceName },
        query,
      }),
      label: i18n.translate('xpack.apm.mobileServiceDetails.transactionsTabLabel', {
        defaultMessage: 'Transactions',
      }),
    },
    {
      key: 'dependencies',
      href: router.link('/mobile-services/{serviceName}/dependencies', {
        path: { serviceName },
        query,
      }),
      label: i18n.translate('xpack.apm.serviceDetails.dependenciesTabLabel', {
        defaultMessage: 'Dependencies',
      }),
    },
    {
      key: 'errors-and-crashes',
      href: router.link('/mobile-services/{serviceName}/errors-and-crashes', {
        path: { serviceName },
        query,
      }),
      label: i18n.translate('xpack.apm.serviceDetails.mobileErrorsTabLabel', {
        defaultMessage: 'Errors & Crashes',
      }),
    },
    {
      key: 'service-map',
      href: router.link('/mobile-services/{serviceName}/service-map', {
        path: { serviceName },
        query,
      }),
      label: i18n.translate('xpack.apm.mobileServiceDetails.serviceMapTabLabel', {
        defaultMessage: 'Service Map',
      }),
    },
    {
      key: 'alerts',
      href: router.link('/mobile-services/{serviceName}/alerts', {
        path: { serviceName },
        query,
      }),
      label: i18n.translate('xpack.apm.mobileServiceDetails.alertsTabLabel', {
        defaultMessage: 'Alerts',
      }),
      hidden: !(isAlertingAvailable && canReadAlerts),
    },
    {
      key: 'dashboards',
      href: router.link('/mobile-services/{serviceName}/dashboards', {
        path: { serviceName },
        query,
      }),
      append: <TechnicalPreviewBadge icon="beaker" />,
      label: i18n.translate('xpack.apm.mobileServiceDetails.dashboardsTabLabel', {
        defaultMessage: 'Dashboards',
      }),
    },
  ];

  return tabs
    .filter((t) => !t.hidden)
    .map(({ href, key, label, append }) => ({
      href,
      label,
      append,
      isSelected: key === selectedTabKey,
      'data-test-subj': `${key}Tab`,
    }));
}

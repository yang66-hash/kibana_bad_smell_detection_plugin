/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import {
  EuiPageHeaderProps,
  EuiFlexGroup,
  EuiFlexItem,
  EuiSkeletonTitle,
  EuiIcon,
} from '@elastic/eui';
import React from 'react';
import type { KibanaPageTemplateProps } from '@kbn/shared-ux-page-kibana-template';
import { useFetcher } from '../../../hooks/use_fetcher';
import { useBSDRouter } from '../../../hooks/use_bsd_router';
import { useAnyOfBSDParams } from '../../../hooks/use_bsd_params';
import { BSDMainTemplate } from './bsd_main_template';
import { useBreadcrumb } from '../../../context/breadcrumbs/use_breadcrumb';

export function ServiceGroupTemplate({
  pageTitle,
  pageHeader,
  children,
  environmentFilter = true,
  serviceGroupContextTab,
  ...pageTemplateProps
}: {
  pageTitle?: React.ReactNode;
  pageHeader?: EuiPageHeaderProps;
  children: React.ReactNode;
  environmentFilter?: boolean;
  serviceGroupContextTab: ServiceGroupContextTab['key'];
} & KibanaPageTemplateProps) {
  const router = useBSDRouter();
  const {
    query,
    query: { serviceGroup: serviceGroupId },
  } = useAnyOfBSDParams('/services', '/service-map');

  const { data } = useFetcher(
    (callApmApi) => {
      if (serviceGroupId) {
        return callApmApi('GET /internal/apm/service-group', {
          params: { query: { serviceGroup: serviceGroupId } },
        });
      }
    },
    [serviceGroupId]
  );

  const serviceGroupName = data?.serviceGroup.groupName;
  const loadingServiceGroupName = !!serviceGroupId && !serviceGroupName;
  const isAllServices = !serviceGroupId;
  const serviceGroupsLink = router.link('/service-groups', {
    query: { ...query, serviceGroup: '' },
  });

  const serviceGroupsPageTitle = (
    <EuiFlexGroup
      direction="row"
      gutterSize="m"
      alignItems="center"
      justifyContent="flexStart"
      responsive={false}
    >
      <EuiFlexItem grow={false}>
        <EuiSkeletonTitle size="l" style={{ width: 180 }} isLoading={loadingServiceGroupName}>
          {serviceGroupName || 'Microservices Inventory'}
        </EuiSkeletonTitle>
      </EuiFlexItem>
    </EuiFlexGroup>
  );

  const tabs = useTabs(serviceGroupContextTab);
  const selectedTab = tabs?.find(({ isSelected }) => isSelected);
  useBreadcrumb(
    () => [
      {
        title: 'microservices',
        href: serviceGroupsLink,
      },
      ...(selectedTab
        ? [
            ...(serviceGroupName
              ? [
                  {
                    title: serviceGroupName,
                    href: router.link('/services', { query }),
                  },
                ]
              : []),
            {
              title: selectedTab.label,
              href: selectedTab.href,
            } as { title: string; href: string },
          ]
        : []),
    ],
    [query, router, selectedTab, serviceGroupName, serviceGroupsLink]
  );
  return (
    <BSDMainTemplate
      pageTitle={serviceGroupsPageTitle}
      pageHeader={{
        tabs,
        breadcrumbs: !isAllServices
          ? [
              {
                text: (
                  <>
                    <EuiIcon size="s" type="arrowLeft" />{' '}
                    {'Return to service groups'}
                  </>
                ),
                color: 'primary',
                'aria-current': false,
                href: serviceGroupsLink,
              },
            ]
          : undefined,
        ...pageHeader,
      }}
      environmentFilter={environmentFilter}
      showServiceGroupSaveButton={!isAllServices}
      showServiceGroupsNav={isAllServices}
      selectedNavButton={isAllServices ? 'allServices' : 'serviceGroups'}
      {...pageTemplateProps}
    >
      {children}
    </BSDMainTemplate>
  );
}

type ServiceGroupContextTab = NonNullable<EuiPageHeaderProps['tabs']>[0] & {
  key: 'service-inventory' | 'service-map';
};

function useTabs(selectedTab: ServiceGroupContextTab['key']) {
  const router = useBSDRouter();
  const { query } = useAnyOfBSDParams('/services', '/service-map');

  const tabs: ServiceGroupContextTab[] = [
    {
      key: 'service-inventory',
      label: 'Inventory',
      href: router.link('/services', { query }),
    },
    {
      key: 'service-map',
      label: 'Service Map',
      href: router.link('/service-map', { query }),
    },
  ];

  return tabs
    .filter((t) => !t.hidden)
    .map(({ href, key, label }) => ({
      href,
      label,
      isSelected: key === selectedTab,
    }));
}

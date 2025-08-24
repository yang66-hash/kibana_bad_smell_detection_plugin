/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import type { NoDataConfig } from '@kbn/shared-ux-page-kibana-template';

function getNoDataConfigDetails({
  basePath,
  isServerless,
  hasAPMIntegrations,
}: {
  basePath?: string;
  isServerless?: boolean;
  hasAPMIntegrations?: boolean;
}) {

  const description = 'This plugin relies on APM Intergation.';

  const addDataTitle = 'Add data';

  if (isServerless) {
    return {
      title: addDataTitle,
      href: `${basePath}/app/bsd/onboarding`,
      description,
    };
  }

  if (hasAPMIntegrations) {
    return {
      title: addDataTitle,
      href: `${basePath}/app/apm/tutorial`,
      description,
    };
  }

  return {
    title:'Add the APM integration',
    href: `${basePath}/app/integrations/detail/apm/overview`,
    description,
  };
}

export function getNoDataConfig({
  docsLink,
  shouldBypassNoDataScreen,
  loading,
  basePath,
  hasAPMData,
  hasAPMIntegrations,
  isServerless,
}: {
  docsLink: string;
  shouldBypassNoDataScreen: boolean;
  loading: boolean;
  basePath?: string;
  hasAPMData?: boolean;
  hasAPMIntegrations?: boolean;
  isServerless?: boolean;
}): NoDataConfig | undefined {
  if (hasAPMData || shouldBypassNoDataScreen || loading) {
    return;
  }
  const noDataConfigDetails = getNoDataConfigDetails({
    basePath,
    isServerless,
    hasAPMIntegrations,
  });

  return {
    solution:'Bad Smell Detection',
    logo: 'logoElastic',
    action: {
      elasticAgent: {
        title: noDataConfigDetails.title,
        description: noDataConfigDetails.description,
        href: noDataConfigDetails.href,
      },
    },
    docsLink,
  };
}

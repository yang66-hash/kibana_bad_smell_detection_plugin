/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import type { NoDataConfig } from '@kbn/shared-ux-page-kibana-template';

function getNoDetectToolConfigDetails({
  basePath,
}: {
  basePath?: string;
}) {

  const description = 'Please ensure that the detection componment is configured.';

  return {
    title:'Add the detection componment configuration',
    href: `${basePath}/app/bsd/detectComConfig`,
    description,
  };
}

export function getNoDetectComConfig({
  docsLink,
  basePath,
}: {
  docsLink: string;
  basePath?: string;
}): NoDataConfig | undefined {
  const noDataConfigDetails = getNoDetectToolConfigDetails({
    basePath,
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

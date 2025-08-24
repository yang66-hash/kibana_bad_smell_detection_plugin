/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { i18n } from '@kbn/i18n';
import { useBreadcrumb } from '../context/breadcrumbs/use_breadcrumb';
import { useAnyOfBSDParams } from './use_bsd_params';
import { useBSDRouter } from './use_bsd_router';

export function useDependencyDetailOperationsBreadcrumb() {
  const {
    query: {
      dependencyName,
      rangeFrom,
      rangeTo,
      refreshInterval,
      refreshPaused,
      environment,
      kuery,
      comparisonEnabled,
    },
  } = useAnyOfBSDParams('/dependencies/operations', '/dependencies/operation');

  const apmRouter = useBSDRouter();

  useBreadcrumb(
    () => [
      {
        title: i18n.translate('xpack.apm.dependencyDetailOperations.breadcrumbTitle', {
          defaultMessage: 'Operations',
        }),
        href: apmRouter.link('/dependencies/operations', {
          query: {
            dependencyName,
            rangeFrom,
            rangeTo,
            refreshInterval,
            refreshPaused,
            environment,
            kuery,
            comparisonEnabled,
          },
        }),
      },
    ],
    [
      apmRouter,
      comparisonEnabled,
      dependencyName,
      environment,
      kuery,
      rangeFrom,
      rangeTo,
      refreshInterval,
      refreshPaused,
    ]
  );
}

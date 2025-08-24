/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
import React from 'react';
import { Outlet } from '@kbn/typed-react-router-config';
import { useBSDParams } from '../../../hooks/use_bsd_params';
import { useBSDRouter } from '../../../hooks/use_bsd_router';
import { ServiceInventoryTitle } from '../home';
import { useBreadcrumb } from '../../../context/breadcrumbs/use_breadcrumb';

export function ApmServiceWrapper() {
  const {
    path: { serviceName },
    query,
  } = useBSDParams('/services/{serviceName}');

  const router = useBSDRouter();

  useBreadcrumb(
    () => [
      {
        title: ServiceInventoryTitle,
        href: router.link('/services', { query }),
      },
      {
        title: serviceName,
        href: router.link('/services/{serviceName}', {
          query,
          path: { serviceName },
        }),
      },
    ],
    [query, router, serviceName]
  );

  return <Outlet />;
}

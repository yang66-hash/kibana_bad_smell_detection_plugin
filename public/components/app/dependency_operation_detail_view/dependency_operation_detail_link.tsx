/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
import React from 'react';
import { EuiLink } from '@elastic/eui';
import { TypeOf } from '@kbn/typed-react-router-config';
import { useBSDRouter } from '../../../hooks/use_bsd_router';
import { BSDRoutes } from '../../routing/bsd_route_config';

type Query = TypeOf<BSDRoutes, '/dependencies/operation'>['query'];

export function DependencyOperationDetailLink(query: Query) {
  const router = useBSDRouter();

  const { spanName } = query;

  const link = router.link('/dependencies/operation', {
    query,
  });

  return (
    <EuiLink data-test-subj="apmDependencyOperationDetailLink" href={link}>
      {spanName}
    </EuiLink>
  );
}

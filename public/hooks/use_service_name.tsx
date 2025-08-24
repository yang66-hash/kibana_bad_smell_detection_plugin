/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { useBSDParams } from './use_bsd_params';

export function useServiceName(): string | undefined {
  const { path } = useBSDParams('/*');

  return 'serviceName' in path ? path.serviceName : undefined;
}

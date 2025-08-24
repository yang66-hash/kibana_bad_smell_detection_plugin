/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
import { useRoutePath, PathsOf } from '@kbn/typed-react-router-config';
import { BSDRoutes } from '../components/routing/bsd_route_config';

export function useApmRoutePath() {
  const path = useRoutePath();

  return path as PathsOf<BSDRoutes>;
}

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { useExecutionContext } from '@kbn/kibana-react-plugin/public';
import { useMatchRoutes } from '@kbn/typed-react-router-config';
import { last } from 'lodash';
import { useBSDPluginContext } from '../../../context/bsd_plugin/use_bsd_plugin_context';

export function UpdateExecutionContextOnRouteChange({
  children,
}: {
  children: React.ReactElement;
}) {
  const { core } = useBSDPluginContext();
  const lastMatch = last(useMatchRoutes());

  useExecutionContext(core.executionContext, {
    type: 'application',
    name: 'bsd',
    page: lastMatch?.match?.path,
  });

  return children;
}

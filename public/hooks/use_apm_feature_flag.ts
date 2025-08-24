/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { ApmFeatureFlagName, ValueOfApmFeatureFlag } from '../../common/apm_feature_flags';
import { useBSDPluginContext } from '../context/bsd_plugin/use_bsd_plugin_context';

export function useBSDFeatureFlag<TApmFeatureFlagName extends ApmFeatureFlagName>(
  featureFlag: TApmFeatureFlagName
): ValueOfApmFeatureFlag<TApmFeatureFlagName> {
  const { config } = useBSDPluginContext();
  return config.featureFlags[featureFlag];
}

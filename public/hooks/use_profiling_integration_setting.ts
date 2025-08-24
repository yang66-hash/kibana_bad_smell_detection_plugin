/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { useUiSetting } from '@kbn/kibana-react-plugin/public';
import {
  apmEnableProfilingIntegration,
  apmEnableTransactionProfiling,
} from '@kbn/observability-plugin/common';
import { ApmFeatureFlagName } from '../../common/apm_feature_flags';
import { useBSDPluginContext } from '../context/bsd_plugin/use_bsd_plugin_context';
import { useBSDFeatureFlag } from './use_apm_feature_flag';

export function useProfilingIntegrationSetting() {
  const isProfilingIntegrationFeatureFlagEnabled = useBSDFeatureFlag(
    ApmFeatureFlagName.ProfilingIntegrationAvailable
  );
  const isProfilingIntegrationUiSettingEnabled = useUiSetting<boolean>(
    apmEnableProfilingIntegration
  );

  return isProfilingIntegrationFeatureFlagEnabled && isProfilingIntegrationUiSettingEnabled;
}

export function useTransactionProfilingSetting() {
  const { core } = useBSDPluginContext();
  const isProfilingIntegrationEnabled = useProfilingIntegrationSetting();

  const isTransactionProfilingEnabled = core.uiSettings.get<boolean>(apmEnableTransactionProfiling);

  return isProfilingIntegrationEnabled && isTransactionProfilingEnabled;
}

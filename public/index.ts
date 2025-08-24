import './index.scss';

import { PluginInitializer, PluginInitializerContext } from '@kbn/core/public';
import { BSDPlugin, BSDPluginSetup, BSDPluginStart } from './plugin';

export interface ConfigSchema {
  serviceMapEnabled: boolean;
  ui: {
    enabled: boolean;
  };
  latestAgentVersionsUrl: string;
  serverlessOnboarding: boolean;
  managedServiceUrl: string;
  featureFlags: {
    agentConfigurationAvailable: boolean;
    configurableIndicesAvailable: boolean;
    infrastructureTabAvailable: boolean;
    infraUiAvailable: boolean;
    migrationToFleetAvailable: boolean;
    sourcemapApiAvailable: boolean;
    storageExplorerAvailable: boolean;
    profilingIntegrationAvailable: boolean;
    ruleFormV2Enabled: boolean;
  };
  serverless: {
    enabled: boolean;
  };
}

export const plugin: PluginInitializer<BSDPluginSetup, BSDPluginStart> = (
  pluginInitializerContext: PluginInitializerContext<ConfigSchema>
) => new BSDPlugin(pluginInitializerContext);

export type { BSDPluginSetup, BSDPluginStart };


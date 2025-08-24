/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import React, { ReactNode, useMemo } from 'react';
import { RouterProvider } from '@kbn/typed-react-router-config';
import { useHistory } from 'react-router-dom';
import { createMemoryHistory, History } from 'history';
import { merge, noop } from 'lodash';
import { coreMock } from '@kbn/core/public/mocks';
import { UrlService } from '@kbn/share-plugin/common/url_service';
import { createObservabilityRuleTypeRegistryMock } from '@kbn/observability-plugin/public';
import {
  LogsLocatorParams,
  NodeLogsLocatorParams,
  TraceLogsLocatorParams,
} from '@kbn/logs-shared-plugin/common';
import { UI_SETTINGS } from '@kbn/data-plugin/common';
import { MlLocatorDefinition } from '@kbn/ml-plugin/public';
import { enableComparisonByDefault } from '@kbn/observability-plugin/public';
import { sharePluginMock } from '@kbn/share-plugin/public/mocks';
import { apmEnableProfilingIntegration } from '@kbn/observability-plugin/common';
import { BSDPluginContext, BSDPluginContextValue } from './bsd_plugin_context';
import { ConfigSchema } from '../..';
import { createCallBSDApi } from '../../services/rest/create_call_bsd_api';
import { bSDRouter } from '../../components/routing/bsd_route_config';

const coreStart = coreMock.createStart({ basePath: '/basepath' });

const mockCore = merge({}, coreStart, {
  application: {
    capabilities: {
      apm: {},
      ml: {},
      savedObjectsManagement: { edit: true },
    },
  },
  uiSettings: {
    get: (key: string) => {
      const uiSettings: Record<string, unknown> = {
        [UI_SETTINGS.TIMEPICKER_QUICK_RANGES]: [
          {
            from: 'now/d',
            to: 'now/d',
            display: 'Today',
          },
          {
            from: 'now/w',
            to: 'now/w',
            display: 'This week',
          },
        ],
        [UI_SETTINGS.TIMEPICKER_TIME_DEFAULTS]: {
          from: 'now-15m',
          to: 'now',
        },
        [UI_SETTINGS.TIMEPICKER_REFRESH_INTERVAL_DEFAULTS]: {
          pause: false,
          value: 100000,
        },
        [enableComparisonByDefault]: true,
        [apmEnableProfilingIntegration]: true,
      };
      return uiSettings[key];
    },
  },
});

const mockConfig: ConfigSchema = {
  serviceMapEnabled: true,
  ui: {
    enabled: false,
  },
  latestAgentVersionsUrl: '',
  serverlessOnboarding: false,
  managedServiceUrl: '',
  featureFlags: {
    agentConfigurationAvailable: true,
    configurableIndicesAvailable: true,
    infrastructureTabAvailable: true,
    infraUiAvailable: true,
    migrationToFleetAvailable: true,
    sourcemapApiAvailable: true,
    storageExplorerAvailable: true,
    profilingIntegrationAvailable: false,
    ruleFormV2Enabled: false,
  },
  serverless: { enabled: false },
};

const urlService = new UrlService({
  navigate: async () => {},
  getUrl: async ({ app, path }, { absolute }) => {
    return `${absolute ? 'http://localhost:8888' : ''}/app/${app}${path}`;
  },
  shortUrls: () => ({ get: () => {} } as any),
});
const locator = urlService.locators.create(new MlLocatorDefinition());

const mockPlugin = {
  ml: {
    locator,
  },
  data: {
    query: {
      timefilter: { timefilter: { setTime: () => {}, getTime: () => ({}) } },
    },
  },
  share: {
    url: {
      locators: {
        get: jest.fn(),
      },
    },
  },
  observabilityShared: {
    locators: {
      profiling: {
        flamegraphLocator: {
          getRedirectUrl: () => '/profiling/flamegraphs/flamegraph',
        },
        topNFunctionsLocator: {
          getRedirectUrl: () => '/profiling/functions/topn',
        },
        stacktracesLocator: {
          getRedirectUrl: () => '/profiling/stacktraces/threads',
        },
      },
    },
  },
};

export const observabilityLogsExplorerLocatorsMock = {
  allDatasetsLocator: sharePluginMock.createLocator(),
  singleDatasetLocator: sharePluginMock.createLocator(),
};

export const logsLocatorsMock = {
  logsLocator: sharePluginMock.createLocator<LogsLocatorParams>(),
  nodeLogsLocator: sharePluginMock.createLocator<NodeLogsLocatorParams>(),
  traceLogsLocator: sharePluginMock.createLocator<TraceLogsLocatorParams>(),
};

const mockCorePlugins = {
  embeddable: {},
  inspector: {},
  maps: {},
  observability: {},
  observabilityShared: {},
  data: {},
};

const mockUnifiedSearch = {
  ui: {
    SearchBar: () => <div className="searchBar" />,
  },
};

export const mockBSDPluginContextValue = {
  appMountParameters: coreMock.createAppMountParameters('/basepath'),
  config: mockConfig,
  core: mockCore,
  plugins: mockPlugin,
  observabilityRuleTypeRegistry: createObservabilityRuleTypeRegistryMock(),
  corePlugins: mockCorePlugins,
  deps: {},
  share: sharePluginMock.createSetupContract(),
  unifiedSearch: mockUnifiedSearch,
  uiActions: {
    getTriggerCompatibleActions: () => Promise.resolve([]),
  },
  observabilityAIAssistant: {
    service: { setScreenContext: jest.fn().mockImplementation(() => noop) },
  },
};

export function MockBSDPluginContextWrapper({
  children,
  value = {} as BSDPluginContextValue,
  history,
}: {
  children?: ReactNode;
  value?: BSDPluginContextValue;
  history?: History;
}) {
  const contextValue = merge({}, mockBSDPluginContextValue, value);

  if (contextValue.core) {
    createCallBSDApi(contextValue.core);
  }

  const contextHistory = useHistory();

  const usedHistory = useMemo(() => {
    return (
      history ||
      contextHistory ||
      createMemoryHistory({
        initialEntries: ['/services/?rangeFrom=now-15m&rangeTo=now'],
      })
    );
  }, [history, contextHistory]);
  return (
    <BSDPluginContext.Provider value={contextValue}>
      <RouterProvider router={bSDRouter as any} history={usedHistory}>
        {children}
      </RouterProvider>
    </BSDPluginContext.Provider>
  );
}

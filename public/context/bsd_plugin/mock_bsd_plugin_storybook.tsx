/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
import { CoreStart } from '@kbn/core/public';
import { EuiThemeProvider } from '@kbn/kibana-react-plugin/common';
import { createKibanaReactContext } from '@kbn/kibana-react-plugin/public';
import { MlLocatorDefinition } from '@kbn/ml-plugin/public';
import { enableInspectEsQueries } from '@kbn/observability-plugin/common';
import { UI_SETTINGS } from '@kbn/observability-shared-plugin/public/hooks/use_kibana_ui_settings';
import { UrlService } from '@kbn/share-plugin/common/url_service';
import { RouterProvider } from '@kbn/typed-react-router-config';
import { createMemoryHistory } from 'history';
import { merge, noop } from 'lodash';
import React, { ReactNode } from 'react';
import { __IntlProvider as IntlProvider } from '@kbn/i18n-react';
import { Observable, of } from 'rxjs';
import { bSDRouter } from '../../components/routing/bsd_route_config';
import { createCallBSDApi } from '../../services/rest/create_call_bsd_api';
import { BSDServiceContext, BSDServiceContextValue } from '../bsd_service/bsd_service_context';
import { MockTimeRangeContextProvider } from '../time_range_metadata/mock_time_range_metadata_context_provider';
import { ApmTimeRangeMetadataContextProvider } from '../time_range_metadata/time_range_metadata_context';
import { BSDPluginContext, BSDPluginContextValue } from './bsd_plugin_context';

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
  [enableInspectEsQueries]: false,
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
};

const mockCore = {
  application: {
    capabilities: {
      apm: {},
      ml: {},
      savedObjectsManagement: {},
    },
    currentAppId$: new Observable(),
    getUrlForApp: (appId: string) => '',
    navigateToUrl: (url: string) => {},
  },
  chrome: {
    docTitle: { change: () => {} },
    setBreadcrumbs: () => {},
    setHelpExtension: () => {},
    setBadge: () => {},
  },
  docLinks: {
    DOC_LINK_VERSION: '0',
    ELASTIC_WEBSITE_URL: 'https://www.elastic.co/',
    links: {
      apm: {},
      observability: { guide: '' },
    },
  },
  http: {
    basePath: {
      prepend: (path: string) => `/basepath${path}`,
      get: () => '/basepath',
    },
  },
  i18n: {
    Context: ({ children }: { children: ReactNode }) => children,
  },
  notifications: {
    toasts: {
      addWarning: () => {},
      addDanger: () => {},
      add: () => {},
    },
  },
  uiSettings: {
    get: (key: string) => uiSettings[key],
    get$: (key: string) => of(mockCore.uiSettings.get(key)),
  },
};

const mockBSDPluginContext = {
  core: mockCore,
  plugins: mockPlugin,
  observabilityAIAssistant: {
    service: { setScreenContext: () => noop },
  },
} as unknown as BSDPluginContextValue;

export function MockApmPluginStorybook({
  children,
  apmContext = {} as BSDPluginContextValue,
  routePath,
  serviceContextValue = {} as BSDServiceContextValue,
}: {
  children?: ReactNode;
  routePath?: string;
  apmContext?: BSDPluginContextValue;
  serviceContextValue?: BSDServiceContextValue;
}) {
  const contextMock = merge({}, mockBSDPluginContext, apmContext);
  createCallBSDApi(contextMock.core);
  const KibanaReactContext = createKibanaReactContext(
    contextMock.core as unknown as Partial<CoreStart>
  );

  const history2 = createMemoryHistory({
    initialEntries: [routePath || '/services/?rangeFrom=now-15m&rangeTo=now'],
  });

  return (
    <IntlProvider locale="en">
      <EuiThemeProvider darkMode={false}>
        <KibanaReactContext.Provider>
          <BSDPluginContext.Provider value={contextMock}>
            <BSDServiceContext.Provider value={serviceContextValue}>
              <RouterProvider router={bSDRouter as any} history={history2}>
                <MockTimeRangeContextProvider>
                  <ApmTimeRangeMetadataContextProvider>
                    {children}
                  </ApmTimeRangeMetadataContextProvider>
                </MockTimeRangeContextProvider>
              </RouterProvider>
            </BSDServiceContext.Provider>
          </BSDPluginContext.Provider>
        </KibanaReactContext.Provider>
      </EuiThemeProvider>
    </IntlProvider>
  );
}

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { APP_WRAPPER_CLASS } from '@kbn/core/public';
import { KibanaContextProvider, useDarkMode } from '@kbn/kibana-react-plugin/public';
import { RedirectAppLinks } from '@kbn/shared-ux-link-redirect-app';
import { Storage } from '@kbn/kibana-utils-plugin/public';
import {
  HeaderMenuPortal,
  InspectorContextProvider,
} from '@kbn/observability-shared-plugin/public';
import { Route } from '@kbn/shared-ux-router';
import { RouteRenderer, RouterProvider } from '@kbn/typed-react-router-config';
import { euiDarkVars, euiLightVars } from '@kbn/ui-theme';
import React from 'react';
import { DefaultTheme, ThemeProvider } from 'styled-components';
import { EuiFlexGroup, EuiFlexItem } from '@elastic/eui';
import { useKibanaEnvironmentContextProvider } from '../../../context/kibana_environment_context/use_kibana_environment_context';
import {
  BSDPluginContext,
  BSDPluginContextValue,
} from '../../../context/bsd_plugin/bsd_plugin_context';
import { useBSDPluginContext } from '../../../context/bsd_plugin/use_bsd_plugin_context';
import { BreadcrumbsContextProvider } from '../../../context/breadcrumbs/context';
import { TimeRangeIdContextProvider } from '../../../context/time_range_id/time_range_id_context';
import { UrlParamsProvider } from '../../../context/url_params_context/url_params_context';
import { BSDPluginStartDeps, BSDServices } from '../../../plugin';
import { bSDRouter } from '../bsd_route_config';
import { TrackPageview } from '../track_pageview';
import { RedirectDependenciesToDependenciesInventory } from './redirect_dependencies_to_dependencies_inventory';
import { RedirectWithDefaultDateRange } from './redirect_with_default_date_range';
import { RedirectWithDefaultEnvironment } from './redirect_with_default_environment';
import { RedirectWithOffset } from './redirect_with_offset';
import { ScrollToTopOnPathChange } from './scroll_to_top_on_path_change';
import { UpdateExecutionContextOnRouteChange } from './update_execution_context_on_route_change';
import { BSDErrorBoundary } from '../bsd_error_boundary';

const storage = new Storage(localStorage);

export function BSDAppRoot({
  bSDPluginContextValue,
  pluginsStart,
  bSDServices,
}: {
  bSDPluginContextValue: BSDPluginContextValue;
  pluginsStart: BSDPluginStartDeps;
  bSDServices: BSDServices;
}) {
  const { appMountParameters, kibanaEnvironment, core } = bSDPluginContextValue;
  const KibanaEnvironmentContextProvider = useKibanaEnvironmentContextProvider(kibanaEnvironment);
  const { history } = appMountParameters;
  const i18nCore = core.i18n;

  return (
    <div className={APP_WRAPPER_CLASS} data-test-subj="bSDMainContainer" role="main">
      <RedirectAppLinks
        coreStart={{
          application: core.application,
        }}
      >
        <BSDPluginContext.Provider value={bSDPluginContextValue}>
          <KibanaContextProvider services={{ ...core, ...pluginsStart, storage, ...bSDServices }}>
            <KibanaEnvironmentContextProvider kibanaEnvironment={kibanaEnvironment}>
              <i18nCore.Context>
                <TimeRangeIdContextProvider>
                  <RouterProvider history={history} router={bSDRouter as any}>
                    <BSDErrorBoundary>
                      <RedirectDependenciesToDependenciesInventory>
                        <RedirectWithDefaultEnvironment>
                          <RedirectWithDefaultDateRange>
                            <RedirectWithOffset>
                              <TrackPageview>
                                <UpdateExecutionContextOnRouteChange>
                                  <BreadcrumbsContextProvider>
                                    <UrlParamsProvider>
                                          <InspectorContextProvider>
                                            <BSDThemeProvider>
                                              {/* <MountBSDHeaderActionMenu /> */}

                                              <Route component={ScrollToTopOnPathChange} />
                                              <RouteRenderer />
                                            </BSDThemeProvider>
                                          </InspectorContextProvider>
                                    </UrlParamsProvider>
                                  </BreadcrumbsContextProvider>
                                </UpdateExecutionContextOnRouteChange>
                              </TrackPageview>
                            </RedirectWithOffset>
                          </RedirectWithDefaultDateRange>
                        </RedirectWithDefaultEnvironment>
                      </RedirectDependenciesToDependenciesInventory>
                    </BSDErrorBoundary>
                  </RouterProvider>
                </TimeRangeIdContextProvider>
              </i18nCore.Context>
            </KibanaEnvironmentContextProvider>
          </KibanaContextProvider>
        </BSDPluginContext.Provider>
      </RedirectAppLinks>
    </div>
  );
}

// function MountBSDHeaderActionMenu() {
//   const {
//     appMountParameters: { setHeaderActionMenu, theme$ },
//   } = useBSDPluginContext();

//   return (
//     <HeaderMenuPortal setHeaderActionMenu={setHeaderActionMenu} theme$={theme$}>
//       <EuiFlexGroup responsive={false} gutterSize="s">
//         <EuiFlexItem>
//           <BSDHeaderActionMenu />
//         </EuiFlexItem>
//       </EuiFlexGroup>
//     </HeaderMenuPortal>
//   );
// }

export function BSDThemeProvider({ children }: { children: React.ReactNode }) {
  const darkMode = useDarkMode(false);

  return (
    <ThemeProvider
      theme={(outerTheme?: DefaultTheme) => ({
        ...outerTheme,
        eui: darkMode ? euiDarkVars : euiLightVars,
        darkMode,
      })}
    >
      {children}
    </ThemeProvider>
  );
}

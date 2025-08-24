import React from 'react';
import ReactDOM from 'react-dom';
import { AppMountParameters, CoreStart } from '@kbn/core/public';
import { KibanaThemeProvider } from '@kbn/kibana-react-plugin/public';
import { BSDAppRoot } from '../components/routing/app_route';
import { setHelpExtension } from '../set_help_extension';
import { setReadonlyBadge } from '../update_badge';
import { createCallBSDApi } from '../services/rest/create_call_bsd_api';
import { BSDPluginSetupDeps, BSDPluginStartDeps, BSDServices } from '../plugin';
import { ConfigSchema } from '..';
import { ObservabilityRuleTypeRegistry } from '@kbn/observability-plugin/public';
import { KibanaEnvContext } from '../context/kibana_environment_context/kibana_environment_context';

export const renderApp = ({
  coreStart,
  pluginsSetup,
  appMountParameters,
  config,
  pluginsStart,
  observabilityRuleTypeRegistry,
  bSDServices,
  kibanaEnvironment,
}: {
  coreStart: CoreStart;
  pluginsSetup: BSDPluginSetupDeps;
  appMountParameters: AppMountParameters;
  config: ConfigSchema;
  pluginsStart: BSDPluginStartDeps;
  observabilityRuleTypeRegistry: ObservabilityRuleTypeRegistry;
  bSDServices: BSDServices;
  kibanaEnvironment: KibanaEnvContext;
}) => {
  const { element, theme$ } = appMountParameters;
  const bSDPluginContextValue = {
    appMountParameters,
    config,
    core: coreStart,
    plugins: pluginsSetup,
    data: pluginsStart.data,
    inspector: pluginsStart.inspector,
    observability: pluginsStart.observability,
    observabilityShared: pluginsStart.observabilityShared,
    observabilityRuleTypeRegistry,
    dataViews: pluginsStart.dataViews,
    unifiedSearch: pluginsStart.unifiedSearch,
    lens: pluginsStart.lens,
    uiActions: pluginsStart.uiActions,
    observabilityAIAssistant: pluginsStart.observabilityAIAssistant,
    share: pluginsSetup.share,
    kibanaEnvironment,
  };

  // render bad smell detection feedback link in global help menu
  setHelpExtension(coreStart);
  setReadonlyBadge(coreStart);
  createCallBSDApi(coreStart);

  element.classList.add('kbnAppWrapper');

  ReactDOM.render(
    <KibanaThemeProvider
      theme$={theme$}
      modify={{
        breakpoint: {
          xxl: 1600,
          xxxl: 2000,
        },
      }}
    >
        <BSDAppRoot
        bSDPluginContextValue={bSDPluginContextValue}
        pluginsStart={pluginsStart}
        bSDServices={bSDServices}
      />

    </KibanaThemeProvider>,
    element
  );
  return () => {
    ReactDOM.unmountComponentAtNode(element);
  };
};
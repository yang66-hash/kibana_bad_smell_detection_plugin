

import type {
  PluginSetupContract as AlertingPluginPublicSetup,
  PluginStartContract as AlertingPluginPublicStart,
} from '@kbn/alerting-plugin/public';
import { ChartsPluginStart } from '@kbn/charts-plugin/public';
import {
  AppMountParameters,
  CoreSetup,
  CoreStart,
  DEFAULT_APP_CATEGORIES,
  HttpStart,
  Plugin,
  PluginInitializerContext,
} from '@kbn/core/public';
import type { DataPublicPluginSetup, DataPublicPluginStart } from '@kbn/data-plugin/public';
import { DataViewsPublicPluginStart } from '@kbn/data-views-plugin/public';
import { DiscoverSetup, DiscoverStart } from '@kbn/discover-plugin/public/plugin';
import type { EmbeddableStart } from '@kbn/embeddable-plugin/public';
import type { ExploratoryViewPublicSetup } from '@kbn/exploratory-view-plugin/public';
import type { FeaturesPluginSetup } from '@kbn/features-plugin/public';
import { FieldFormatsStart } from '@kbn/field-formats-plugin/public';
import type { FleetStart } from '@kbn/fleet-plugin/public';
import type { HomePublicPluginSetup } from '@kbn/home-plugin/public';
import { MetricsDataPluginStart } from '@kbn/metrics-data-access-plugin/public';
import { Start as InspectorPluginStart } from '@kbn/inspector-plugin/public';
import type { IStorageWrapper } from '@kbn/kibana-utils-plugin/public';
import { LensPublicStart } from '@kbn/lens-plugin/public';
import { LicenseManagementUIPluginSetup } from '@kbn/license-management-plugin/public';
import type { LicensingPluginSetup } from '@kbn/licensing-plugin/public';
import type { MapsStartApi } from '@kbn/maps-plugin/public';
import type { MlPluginSetup, MlPluginStart } from '@kbn/ml-plugin/public';
import type {
  ObservabilityAIAssistantPublicSetup,
  ObservabilityAIAssistantPublicStart,
} from '@kbn/observability-ai-assistant-plugin/public';
import {
  FetchDataParams,
  ObservabilityPublicSetup,
  ObservabilityPublicStart,
} from '@kbn/observability-plugin/public';
import type {
  ObservabilitySharedPluginSetup,
  ObservabilitySharedPluginStart,
} from '@kbn/observability-shared-plugin/public';
import type { SecurityPluginStart } from '@kbn/security-plugin/public';
import type { SharePluginSetup } from '@kbn/share-plugin/public';
import { SpacesPluginStart } from '@kbn/spaces-plugin/public';
import type {
  TriggersAndActionsUIPublicPluginSetup,
  TriggersAndActionsUIPublicPluginStart,
} from '@kbn/triggers-actions-ui-plugin/public';
import { UiActionsSetup, UiActionsStart } from '@kbn/ui-actions-plugin/public';
import type { UnifiedSearchPublicPluginStart } from '@kbn/unified-search-plugin/public';
import { DashboardStart } from '@kbn/dashboard-plugin/public';
import type { IUiSettingsClient } from '@kbn/core-ui-settings-browser';
import type { CloudSetup } from '@kbn/cloud-plugin/public';
import { ProfilingPluginSetup, ProfilingPluginStart } from '@kbn/profiling-plugin/public';

import { ITelemetryClient, TelemetryService } from './services/telemetry';
import { MaybePromise } from '@kbn/utility-types';
import { ConfigSchema } from '.';
import { createLazyBSDPageTemplate, LazyBSDPageTemplateProps } from './components/shared/template/page_template';
import { createNavigationRegistry } from './components/shared/template/page_template/helpers/navigation_registry';
import { BehaviorSubject, of } from 'rxjs';
import { BAD_SMELL_DETECTION_OVERVIEW_ID, BAD_SMELL_DETECTION_OVERVIEW_NAME } from '../common/constants';
import ReactDOM from 'react-dom';




export type BSDPluginSetup = ReturnType<BSDPlugin['setup']>;
export type BSDPluginStart = void;

export interface BSDPluginSetupDeps {
  alerting?: AlertingPluginPublicSetup;
  data: DataPublicPluginSetup;
  discover?: DiscoverSetup;
  exploratoryView: ExploratoryViewPublicSetup;
  unifiedSearch: UnifiedSearchPublicPluginStart;
  features: FeaturesPluginSetup;
  home?: HomePublicPluginSetup;
  licensing: LicensingPluginSetup;
  licenseManagement?: LicenseManagementUIPluginSetup;
  ml?: MlPluginSetup;
  observability: ObservabilityPublicSetup;
  observabilityShared: ObservabilitySharedPluginSetup;
  observabilityAIAssistant?: ObservabilityAIAssistantPublicSetup;
  triggersActionsUi: TriggersAndActionsUIPublicPluginSetup;
  share: SharePluginSetup;
  uiActions: UiActionsSetup;
  profiling?: ProfilingPluginSetup;
  cloud?: CloudSetup;
}

export interface BSDServices {
  telemetry: ITelemetryClient;
}

export interface BSDPluginStartDeps {
  alerting?: AlertingPluginPublicStart;
  charts?: ChartsPluginStart;
  data: DataPublicPluginStart;
  discover?: DiscoverStart;
  embeddable: EmbeddableStart;
  home: void;
  inspector: InspectorPluginStart;
  licensing: void;
  maps?: MapsStartApi;
  ml?: MlPluginStart;
  triggersActionsUi: TriggersAndActionsUIPublicPluginStart;
  observability: ObservabilityPublicStart;
  observabilityShared: ObservabilitySharedPluginStart;
  observabilityAIAssistant?: ObservabilityAIAssistantPublicStart;
  fleet?: FleetStart;
  fieldFormats?: FieldFormatsStart;
  security?: SecurityPluginStart;
  spaces?: SpacesPluginStart;
  dataViews: DataViewsPublicPluginStart;
  unifiedSearch: UnifiedSearchPublicPluginStart;
  storage: IStorageWrapper;
  lens: LensPublicStart;
  uiActions: UiActionsStart;
  profiling?: ProfilingPluginStart;
  dashboard: DashboardStart;
  metricsDataAccess: MetricsDataPluginStart;
  uiSettings: IUiSettingsClient;
  BSDPageTemplate?: React.FC<LazyBSDPageTemplateProps>;
}

const servicesTitle = 'Services';
const serviceGroupsTitle =  'Service groups';
const tracesTitle = 'Traces';
const serviceMapTitle = 'Service Map';
const dependenciesTitle =  'Dependencies';
const bSDSettingsTitle = 'Settings';
const bSDStorageExplorerTitle = 'Storage Explorer';
const bSDTutorialTitle = 'Tutorial';
const detectionTitle = 'detecting';

export class BSDPlugin implements Plugin<BSDPluginSetup, BSDPluginStart> {
  private readonly navigationRegistry = createNavigationRegistry();
  private telemetry: TelemetryService;
  private kibanaVersion: string;
  private isServerlessEnv: boolean;
  private isSidebarEnabled$: BehaviorSubject<boolean>;

  constructor(private readonly initializerContext: PluginInitializerContext<ConfigSchema>) {
    this.initializerContext = initializerContext;
    this.telemetry = new TelemetryService();
    this.kibanaVersion = initializerContext.env.packageInfo.version;
    this.isServerlessEnv = initializerContext.env.packageInfo.buildFlavor === 'serverless';
    this.isSidebarEnabled$ = new BehaviorSubject<boolean>(true);

  }

  setup(core: CoreSetup, plugins: BSDPluginSetupDeps) {

    const config = this.initializerContext.config.get();
    const pluginSetupDeps = plugins;
    const { featureFlags } = config;

    const getBSDDataHelper = async () => {
      const { fetchObservabilityOverviewPageData, getHasData } = await import(
        './services/rest/bsd_observability_overview_fetchers'
      );

      const { createCallBSDApi } = await import('./services/rest/create_call_bsd_api');

      // have to do this here as well in case app isn't mounted yet
      createCallBSDApi(core);

      return {
        fetchObservabilityOverviewPageData,
        getHasData,
      };
    };

    this.telemetry.setup({ analytics: core.analytics });
    console.log("1111111111111111111111111");

    // plugins.observability.dashboard.register({
    //   appName: 'bsd',
    //   hasData: async () => {
    //     const dataHelper = await getBSDDataHelper();
    //     return await dataHelper.getHasData();
    //   },
    //   fetchData: async (params: FetchDataParams) => {
    //     const dataHelper = await getBSDDataHelper();
    //     return await dataHelper.fetchObservabilityOverviewPageData(params);
    //   },
    // });




    const { observabilityRuleTypeRegistry } = plugins.observability;

    
    // Register APM telemetry based events


    const telemetry = this.telemetry.start();


    this.navigationRegistry.registerSections(of(
      [
        {
          label: 'Bad Smell Knowledges',
          sortKey: 200,
          entries: [
            { label: 'Knowledge Base', app: 'bsd', path: '/base', matchFullPath: false,  },
          ],
        },
        {
          label: 'Monitor',
          sortKey: 300,
          entries: [
            { label: 'Services', app: 'bsd', path: '/services', matchFullPath: false },
            { label: 'Traces', app: 'bsd', path: '/traces', matchFullPath: false },
          ],
        },
        {
          label: 'Detection',
          sortKey: 300,
          entries: [
            { label: 'Detection', app: 'bsd', path: '/detect', matchFullPath: false },
            { label: 'Display', app: 'bsd', path: '/display', matchFullPath: false },
            { label: 'Statistics Panel', app: 'bsd', path: '/statistics', matchFullPath: false },
          ],
        }
      ]
    ));

    console.log("ssssssssssssssssssssssssssss");
    core.application.register({
      id: 'bsd',
      title: 'Bad Smell Detection',
      order: 8300,
      euiIconType: 'logoSecurity',
      appRoute: '/bsd',
      icon: './icon.svg',
      deepLinks: [
        {
          id: 'service-groups-list',
          title: serviceGroupsTitle,
          path: '/service-groups',
        },
        {
          id: 'services',
          title: servicesTitle,
          path: '/services',
        },
        {
          id: 'traces',
          title: tracesTitle,
          path: '/traces',
        },
        {
          id: 'dependencies',
          title: dependenciesTitle,
          path: '/dependencies/inventory',
        },
        { id: 'settings', title: bSDSettingsTitle, path: '/settings' },
        {
          id: 'storage-explorer',
          title: bSDStorageExplorerTitle,
          path: '/storage-explorer',
          visibleIn: featureFlags.storageExplorerAvailable ? ['globalSearch'] : [],
        },
        { id: 'tutorial', title: bSDTutorialTitle, path: '/tutorial' }
      ],
      mount: async (appMountParameters: AppMountParameters<unknown>) => {
        // Load application bundle and Get start services
        const [{ renderApp }, [coreStart, pluginsStart]] = await Promise.all([
          import('./application'),
          core.getStartServices(),
        ]);

        const isCloudEnv = !!pluginSetupDeps.cloud?.isCloudEnabled;
        const isServerlessEnv = pluginSetupDeps.cloud?.isServerlessEnabled || this.isServerlessEnv;
        return renderApp({
          coreStart,
          pluginsSetup: pluginSetupDeps as BSDPluginSetupDeps,
          appMountParameters,
          config,
          kibanaEnvironment: {
            isCloudEnv,
            isServerlessEnv,
            kibanaVersion: this.kibanaVersion,
          },
          pluginsStart: pluginsStart as BSDPluginStartDeps,
          observabilityRuleTypeRegistry,
          bSDServices: {
            telemetry,
          },
        });
      },
    });


    core.application.register({
      id: BAD_SMELL_DETECTION_OVERVIEW_ID,
      title: BAD_SMELL_DETECTION_OVERVIEW_NAME,
      euiIconType: 'logoObservability',
      appRoute: '/app/bsd',
            deepLinks: [
        {
          id: 'overview',
          title: 'overview',
          path: '/overview',
        },
      ],
      mount: async (appMountParameters: AppMountParameters<unknown>) => {
        // Load application bundle and Get start services
        const [{ renderApp }, [coreStart, pluginsStart]] = await Promise.all([
          import('./application'),
          core.getStartServices(),
        ]);

        const isCloudEnv = !!pluginSetupDeps.cloud?.isCloudEnabled;
        const isServerlessEnv = pluginSetupDeps.cloud?.isServerlessEnabled || this.isServerlessEnv;
        return renderApp({
          coreStart,
          pluginsSetup: pluginSetupDeps as BSDPluginSetupDeps,
          appMountParameters,
          config,
          kibanaEnvironment: {
            isCloudEnv,
            isServerlessEnv,
            kibanaVersion: this.kibanaVersion,
          },
          pluginsStart: pluginsStart as BSDPluginStartDeps,
          observabilityRuleTypeRegistry,
          bSDServices: {
            telemetry,
          },
        });
      },

    })
  }
  start(core: CoreStart, plugins: BSDPluginStartDeps) {

    //use to create navigation
    const { application } = core;

    const PageTemplate = createLazyBSDPageTemplate({
      currentAppId$: application.currentAppId$,
      getUrlForApp: application.getUrlForApp,
      navigateToApp: application.navigateToApp,
      navigationSections$: this.navigationRegistry.sections$,
      // guidedOnboardingApi: plugins.guidedOnboarding?.guidedOnboardingApi,
      getPageTemplateServices: () => ({ coreStart: core }),
      isSidebarEnabled$: this.isSidebarEnabled$,
    });
    plugins.BSDPageTemplate = PageTemplate;

  }
  stop?(): MaybePromise<void> {
  }

}
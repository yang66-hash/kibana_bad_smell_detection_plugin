import { EuiFlexGroup, EuiFlexItem, EuiPageHeaderProps } from '@elastic/eui';
import { useKibana } from '@kbn/kibana-react-plugin/public';
import { ObservabilityPageTemplateProps } from '@kbn/observability-shared-plugin/public';
import type { KibanaPageTemplateProps } from '@kbn/shared-ux-page-kibana-template';
import React, { useContext } from 'react';
import { useLocation } from 'react-router-dom';
import { FeatureFeedbackButton } from '@kbn/observability-shared-plugin/public';
// import { useDefaultAiAssistantStarterPromptsForAPM } from '../../../hooks/use_default_ai_assistant_starter_prompts_for_apm';
import { KibanaEnvironmentContext } from '../../../context/kibana_environment_context/kibana_environment_context';
import { getPathForFeedback } from '../../../utils/get_path_for_feedback';
import { EnvironmentsContextProvider } from '../../../context/environments_context/environments_context';
import { FETCH_STATUS, useFetcher } from '../../../hooks/use_fetcher';
import { BSDPluginStartDeps } from '../../../plugin';
import { ServiceGroupSaveButton } from '../../app/service_groups';
import { BSDEnvironmentFilter } from '../../shared/environment_filter';
import { getNoDataConfig } from './no_data_config';
import { useBSDPluginContext } from '../../../context/bsd_plugin/use_bsd_plugin_context';

// Paths that must skip the no data screen
const bypassNoDataScreenPaths = ['base'];
const BSD_FEEDBACK_LINK = 'https://github.com/yang66-hash/bad_smell_detection_plugin';

export function BSDMainTemplate({
  pageTitle,
  pageHeader,
  children,
  environmentFilter = true,
  showServiceGroupSaveButton = false,
  showServiceGroupsNav = false,
  environmentFilterInTemplate = true,
  selectedNavButton,
  ...pageTemplateProps
}: {
  pageTitle?: React.ReactNode;
  pageHeader?: EuiPageHeaderProps;
  children: React.ReactNode;
  environmentFilter?: boolean;
  showServiceGroupSaveButton?: boolean;
  showServiceGroupsNav?: boolean;
  selectedNavButton?: 'allServices';
} & KibanaPageTemplateProps &
  Pick<ObservabilityPageTemplateProps, 'pageSectionProps'>) {
  const location = useLocation();

  const { services } = useKibana<BSDPluginStartDeps>();
  const kibanaEnvironment = useContext(KibanaEnvironmentContext);
  const { http, application , BSDPageTemplate} = services;
  const { kibanaVersion, isCloudEnv, isServerlessEnv } = kibanaEnvironment;
  const basePath = http?.basePath.get();
  const { config } = useBSDPluginContext();

  const ObservabilityPageTemplate = BSDPageTemplate!;

  const { data, status } = useFetcher((callBSDApi) => {
    return callBSDApi('GET /internal/apm/has_data');
  }, []);

  // create static data view on initial load
  useFetcher(
    (callBSDApi) => {
      const canCreateDataView = application?.capabilities.savedObjectsManagement.edit;

      if (canCreateDataView) {
        return callBSDApi('POST /internal/apm/data_view/static');
      }
    },
    [application?.capabilities.savedObjectsManagement.edit]
  );

  const shouldBypassNoDataScreen = bypassNoDataScreenPaths.some((path) =>
    location.pathname.includes(path)
  );

  const { data: fleetBSDPoliciesData, status: fleetBSDPoliciesStatus } = useFetcher(
    (callBSDApi) => {
      if (!data?.hasData && !shouldBypassNoDataScreen) {
        return callBSDApi('GET /internal/apm/fleet/has_apm_policies');
      }
    },
    [shouldBypassNoDataScreen, data?.hasData]
  );

  console.log('fleetBSDPoliciesData: ' ,fleetBSDPoliciesData);

  const isLoading =
    status === FETCH_STATUS.LOADING || fleetBSDPoliciesStatus === FETCH_STATUS.LOADING;

  const hasAPMData = !!data?.hasData;
  const hasAPMIntegrations = !!fleetBSDPoliciesData?.hasApmPolicies;

  const noDataConfig = getNoDataConfig({
    basePath,
    docsLink: "https://github.com/yang66-hash",
    hasAPMData,
    hasAPMIntegrations,
    shouldBypassNoDataScreen,
    loading: isLoading,
    isServerless: config?.serverlessOnboarding,
  });


  // useDefaultAiAssistantStarterPromptsForAPM({
  //   hasAPMData,
  //   hasAPMIntegrations,
  //   noDataConfig,
  // });

  // const rightSideItems = [...(showServiceGroupSaveButton ? [<ServiceGroupSaveButton />] : [])];

  const sanitizedPath = getPathForFeedback(window.location.pathname);
  const pageHeaderTitle = (
    <EuiFlexGroup justifyContent="spaceBetween" wrap={true}>
      {pageHeader?.pageTitle ?? pageTitle}
      <EuiFlexItem grow={false}>
        <EuiFlexGroup justifyContent="center">
          <EuiFlexItem grow={false}>
            <FeatureFeedbackButton
              data-test-subj="infraBSDFeedbackLink"
              formUrl={BSD_FEEDBACK_LINK}
              kibanaVersion={kibanaVersion}
              isCloudEnv={isCloudEnv}
              isServerlessEnv={isServerlessEnv}
              sanitizedPath={sanitizedPath}
            />
          </EuiFlexItem>
          <EuiFlexItem grow={false}>{environmentFilter && <BSDEnvironmentFilter />}</EuiFlexItem>
        </EuiFlexGroup>
      </EuiFlexItem>
    </EuiFlexGroup>
  );

  const pageTemplate = (
    <ObservabilityPageTemplate
      noDataConfig={shouldBypassNoDataScreen ? undefined : noDataConfig}
      isPageDataLoaded={isLoading === false}
      pageHeader={{
        // rightSideItems,
        ...pageHeader,
        pageTitle: pageHeaderTitle,
      }}
      {...pageTemplateProps}
    >
      {children}
    </ObservabilityPageTemplate>
  );

  return <EnvironmentsContextProvider>{pageTemplate}</EnvironmentsContextProvider>;

  return pageTemplate;
}

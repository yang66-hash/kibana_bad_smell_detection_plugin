/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { toBooleanRt, toNumberRt } from '@kbn/io-ts-utils';
import { Outlet } from '@kbn/typed-react-router-config';
import * as t from 'io-ts';
import React, { ComponentProps, useEffect, useState } from 'react';
import { offsetRt } from '../../../../common/comparison_rt';
import { ENVIRONMENT_ALL } from '../../../../common/environment_filter_values';
import { environmentRt } from '../../../../common/environment_rt';
import { TraceSearchType } from '../../../../common/trace_explorer';
import { ApmTimeRangeMetadataContextProvider } from '../../../context/time_range_metadata/time_range_metadata_context';
import { Breadcrumb } from '../../app/breadcrumb';
import { ServiceInventory } from '../../app/service_inventory';
import { TopTracesOverview } from '../../app/top_traces_overview';
import { TraceExplorer } from '../../app/trace_explorer';
import { TraceExplorerAggregatedCriticalPath } from '../../app/trace_explorer/trace_explorer_aggregated_critical_path';
import { TraceExplorerWaterfall } from '../../app/trace_explorer/trace_explorer_waterfall';
import { TraceOverview } from '../../app/trace_overview';
import { TransactionTab } from '../../app/transaction_details/waterfall_with_summary/transaction_tabs';
import { RedirectTo } from '../redirect_to';
import { ServiceGroupTemplate } from '../templates/service_group_template';
import { dependencies } from './dependencies';
// import { legacyBackends } from './legacy_backends';
import { storageExplorer } from './storage_explorer';
import { KnowledgeBase } from '../../knowledge_base/bs_knowledge_base';
import { BadSmellSingle } from '../../knowledge_base/bs_single_page/bad_smell_single';
import { DetectionOverview } from '../../app/detection_overview';
import { DetectComSetView } from '../../app/detect_component_set_view/detec_com_set_view';
import { InternalDesignDetectionView } from '../../app/detction_view/internal_design_detection_detail_view';
import { StructureInfrastructureView } from '../../app/detction_view/structure_infrastructure_view copy';
import { CommunicationInteractionView } from '../../app/detction_view/communication_interaction_view';
import { SecurityView } from '../../app/detction_view/security_view';
import { LifecycleManagementView } from '../../app/detction_view/lifecycle_management_view';
import { TeamTechnologyView } from '../../app/detction_view/team_technology_view';
import { BadSmellPluginOverviewPage } from '../../app/bad_smell_plugin_overview';
import { DecompositionView } from '../../app/detction_view/decomposition_view';
import { DynamicPageView } from '../../app/detction_view/dynamic/dynamic_page_view';
import { ShowDetectionResultOverview } from '../../app/detection_result_show_overview';
import { ShowDetectionResultView } from '../../app/show_detection_result';
import { DisplayRecordsByCateView } from '../../app/show_detection_result/display_by_cate_view';
import { OverallDetectView } from '../../app/detction_view/overall/overall_detect_view';
import { StastisticPanel } from '../../app/bsd_statistic_panel';


function serviceGroupPage<TPath extends string>({
  path,
  element,
  title,
  serviceGroupContextTab,
}: {
  path: TPath;
  element: React.ReactElement<any, any>;
  title: string;
  serviceGroupContextTab: ComponentProps<typeof ServiceGroupTemplate>['serviceGroupContextTab'];
}): Record<
  TPath,
  {
    element: React.ReactElement<any, any>;
    params: t.TypeC<{ query: t.TypeC<{ serviceGroup: t.StringC }> }>;
    defaults: { query: { serviceGroup: string } };
  }
> {
  return {
    [path]: {
      element: (
        <Breadcrumb title={title} href={path}>
          <ServiceGroupTemplate pageTitle={title} serviceGroupContextTab={serviceGroupContextTab}>
            {element}
          </ServiceGroupTemplate>
        </Breadcrumb>
      ),
      params: t.type({
        query: t.type({ serviceGroup: t.string }),
      }),
      defaults: { query: { serviceGroup: '' } },
    },
  } as Record<
    TPath,
    {
      element: React.ReactElement<any, any>;
      params: t.TypeC<{ query: t.TypeC<{ serviceGroup: t.StringC }> }>;
      defaults: { query: { serviceGroup: string } };
    }
  >;
}

export const ServiceInventoryTitle = 'Services';
export const ServiceMapTitle =  'Service Map';

export const DependenciesOperationsTitle = 'Operations';


export const homeRoute = {
  '/base': {
    element: <KnowledgeBase />,
  },
  '/bad_smell':{
    element: <BadSmellSingle />,
    params: t.partial({
      query: t.type({
        name: t.string
      }),
    }),
    default: {
      query: {
        name: ''
      }
    }
  },

  '/detectComConfig':{
    element: <DetectComSetView />,
  },
  '/display':{
    element:
    <ShowDetectionResultOverview>
      <Outlet/>
    </ShowDetectionResultOverview>,
    children:{
      '/display':{
        element: <ShowDetectionResultView/>,
      },
      '/display/cate/details': {
        element: <DisplayRecordsByCateView />,
        params: t.type({
          query: t.intersection([
            t.type({
              badSmellType: t.string,
            }),
            t.partial({
            })
          ]),
        })
      }
    }
    
  },
  '/': {
    element: (
      <ApmTimeRangeMetadataContextProvider>
        <Outlet />
      </ApmTimeRangeMetadataContextProvider>
    ),
    params: t.type({
      query: t.intersection([
        environmentRt,
        t.type({
          rangeFrom: t.string,
          rangeTo: t.string,
          kuery: t.string,
          comparisonEnabled: toBooleanRt,
        }),
        t.partial({
          refreshPaused: t.union([t.literal('true'), t.literal('false')]),
          refreshInterval: t.string,
          page: toNumberRt,
          pageSize: toNumberRt,
          sortField: t.string,
          sortDirection: t.union([t.literal('asc'), t.literal('desc')]),
        }),
        offsetRt,
      ]),
    }),
    defaults: {
      query: {
        environment: ENVIRONMENT_ALL.value,
        kuery: '',
      },
    },
    children: {
      '/': { element: <RedirectTo pathname="/overview" /> },
      '/overview':{
        element: (
          <BadSmellPluginOverviewPage />
        ),
      },
      ...serviceGroupPage({
        path: '/services',
        title: ServiceInventoryTitle,
        element: <ServiceInventory />,
        serviceGroupContextTab: 'service-inventory',
      }),
      // ...serviceGroupPage({
      //   path: '/service-map',
      //   title: ServiceMapTitle,
      //   element: <ServiceMapHome />,
      //   serviceGroupContextTab: 'service-map',
      // }),
      '/traces': {
        element: (
          <TraceOverview>
            <Outlet />
          </TraceOverview>
        ),
        // children: {
        //   '/traces': {
        //     element: <TopTracesOverview />,
            
        //   },
        // },
      },
      '/detect':{
        element: (
          <DetectionOverview>
            <Outlet />
          </DetectionOverview>
        ),
        params: t.type({
          query: t.intersection([
            t.type({
              badSmellType: t.string,
            }),
            t.partial({
            })
          ]),
        }),
        defaults: {
          query: {
            badSmellType: 'Internal Design', 
          },
        },
    
        children: {
          '/detect': {
            element: <RedirectTo pathname="/detect/overall" />,
          },
          '/detect/internaldesign': {
            element: <InternalDesignDetectionView />,
            defaults: {
              query: {
                badSmellType: 'Internal Design', 
              },
            },
          },
          '/detect/cominter': {
            element: <CommunicationInteractionView />,
            defaults: {
              query: {
                badSmellType: 'Communication & Interaction', 
              },
            },
          },
          '/detect/strinfra': {
            element: <StructureInfrastructureView />,
            defaults: {
              query: {
                badSmellType: 'Structure & Infrastructure', 
              },
            },
          },
          '/detect/decompos': {
            element: <DecompositionView />,
            defaults: {
              query: {
                badSmellType: 'Decomposition', 
              },
            },
          },
          '/detect/security': {
            element: <SecurityView />,
            defaults: {
              query: {
                badSmellType: 'Security', 
              },
            },
          },
          '/detect/lifeman': {
            element: <LifecycleManagementView />,
            defaults: {
              query: {
                badSmellType: 'Lifecycle Management', 
              },
            },
          },
          '/detect/teamtech': {
            element: <TeamTechnologyView />,
            defaults: {
              query: {
                badSmellType: 'Team & Technology', 
              },
            },
          },
          '/detect/dynamic': {
            element: <DynamicPageView/>,
            params: t.type({
              query: t.intersection([
                t.type({
                  detectMethod: t.string,
                }),
                t.partial({
                })
              ]),
            }),
            defaults: {
              query: {
                badSmellType: '',
                detectMethod: 'dynamic',
              },
            },
        
          },
          '/detect/overall': {
            element: <OverallDetectView/>
          }
        },        
      },
      '/statistics':{
        element: <StastisticPanel />,
      },
      
      // ...dependencies,
      // ...legacyBackends,
      // ...storageExplorer,
    },
  }
};

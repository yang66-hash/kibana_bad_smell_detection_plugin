/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { i18n } from '@kbn/i18n';
import React, { useEffect, useMemo } from 'react';

import {
  EuiFlexGroup,
  EuiFlexGroupProps,
  EuiFlexItem,
  EuiLink,
  EuiPanel,
  EuiSpacer,
} from '@elastic/eui';
import { useBSDPluginContext } from '../../../context/bsd_plugin/use_bsd_plugin_context';
import {
  isRumAgentName,
  isServerlessAgentName,
} from '../../../../common/agent_name';
import { AnnotationsContextProvider } from '../../../context/annotations/annotations_context';
import { useBSDServiceContext } from '../../../context/bsd_service/use_bsd_service_context';
import { ChartPointerEventContextProvider } from '../../../context/chart_pointer_event/chart_pointer_event_context';
import { useBSDParams } from '../../../hooks/use_bsd_params';
import { useBreakpoints } from '../../../hooks/use_breakpoints';
import { useTimeRange } from '../../../hooks/use_time_range';
import { ServiceOverviewInstancesChartAndTable } from './service_overview_instances_chart_and_table';
import { ViewMode } from '@kbn/embeddable-plugin/public';
import { DashboardRenderer, DashboardCreationOptions } from '@kbn/dashboard-plugin/public';
import { getDefaultControlGroupInput } from '@kbn/controls-plugin/common';
/**
 * The height a chart should be if it's next to a table with 5 rows and a title.
 * Add the height of the pagination row.
 */
export const chartHeight = 288;

export function ServiceOverview() {
  const { serviceName, agentName, serverlessType } = useBSDServiceContext();

  const setScreenContext = useBSDPluginContext().observabilityAIAssistant?.service.setScreenContext;

  useEffect(() => {
    return setScreenContext?.({
      screenDescription: `The user is looking at the service overview page for ${serviceName}.`,
      data: [
        {
          name: 'service_name',
          description: 'The name of the service',
          value: serviceName,
        },
      ],
    });
  }, [setScreenContext, serviceName]);

  const {
    query: {  environment, rangeFrom, rangeTo },
  } = useBSDParams('/services/{serviceName}/overview');

  const { start, end } = useTimeRange({ rangeFrom, rangeTo });
  const timeRange = useMemo(() => ({
    from: rangeFrom,
    to: rangeTo,
  }), [rangeFrom, rangeTo]);
  const isRumAgent = isRumAgentName(agentName);
  const isServerless = isServerlessAgentName(serverlessType);

 

  // The default EuiFlexGroup breaks at 768, but we want to break at 1200, so we
  // observe the window width and set the flex directions of rows accordingly
  const { isLarge } = useBreakpoints();
  const isSingleColumn = isLarge;

  const latencyChartHeight = 200;
  const nonLatencyChartHeight = isSingleColumn ? latencyChartHeight : chartHeight;
  const dashboardSavedObjectId = "88f2fa70-a8e2-4d89-a842-7bdd033d8920";


  return (
    <AnnotationsContextProvider
      serviceName={serviceName}
      environment={environment}
      start={start}
      end={end}
    >
      <ChartPointerEventContextProvider>
      <EuiFlexGroup direction="column">
        <EuiFlexItem>
          <DashboardRenderer
            key={`dashboard-${rangeFrom}-${rangeTo}`}
            savedObjectId={dashboardSavedObjectId}
            showPlainSpinner={true}
            getCreationOptions={async (): Promise<DashboardCreationOptions> => {
              const controlGroupInput = getDefaultControlGroupInput();
              
              // 创建 targetInstance 过滤条件
              const targetInstanceFilter = {
                meta: {
                  index: 'bsd.detection.results*', // 使用 bsd.detection.results* 索引模式
                  alias: null,
                  negate: false,
                  disabled: false,
                  type: 'phrase',
                  key: 'targetInstance', // 目标实例字段
                  value: serviceName,
                  params: {
                    query: serviceName,
                    type: 'phrase'
                  }
                },
                query: {
                  match_phrase: {
                    'targetInstance': serviceName
                  }
                },
                $state: {
                  store: 'appState'
                }
              };
              
              return {
                useControlGroupIntegration: true,
                getInitialInput: () => ({
                  timeRange,
                  viewMode: ViewMode.VIEW,
                  controlGroupInput,
                  filters: [targetInstanceFilter], // 添加 targetInstance 过滤
                  query: {
                    query: '',
                    language: 'kuery'
                  }
                }),
              };
            }}
          />
        </EuiFlexItem>
      </EuiFlexGroup>
        <EuiFlexGroup direction="column" gutterSize="s">
          {!isRumAgent && !isServerless && (
            <EuiFlexItem>
              <EuiFlexGroup direction="column" gutterSize="s" responsive={false}>
                <ServiceOverviewInstancesChartAndTable
                  chartHeight={nonLatencyChartHeight}
                  serviceName={serviceName}
                />
              </EuiFlexGroup>
            </EuiFlexItem>
          )}
        </EuiFlexGroup>

      </ChartPointerEventContextProvider>
    </AnnotationsContextProvider>
  );
}

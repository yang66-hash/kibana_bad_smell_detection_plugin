
import {  EuiPanel, EuiSpacer} from '@elastic/eui';
import React, { useEffect, useMemo } from 'react';
import { useHistory } from 'react-router-dom';
import { useBSDPluginContext } from '../../../context/bsd_plugin/use_bsd_plugin_context';
import { useBSDServiceContext } from '../../../context/bsd_service/use_bsd_service_context';
import { useBSDParams } from '../../../hooks/use_bsd_params';
import { useTimeRange } from '../../../hooks/use_time_range';
import { replace } from '../../shared/links/url_helpers';
import { BSDDeclarationCallout } from '../bsd_callout/bsd_declaration_callout';
import { ViewMode } from '@kbn/embeddable-plugin/public';
import { DashboardRenderer, DashboardCreationOptions } from '@kbn/dashboard-plugin/public';
import { getDefaultControlGroupInput } from '@kbn/controls-plugin/common';
import { AnomalousTracesTable } from '../../shared/cyclic_dependency_table';

export function TransactionOverview() {
  const {
    query: {
     
      rangeFrom,
      rangeTo,
      transactionType: transactionTypeFromUrl,
      
    },
  } = useBSDParams('/services/{serviceName}/transactions');

  const { start, end } = useTimeRange({ rangeFrom, rangeTo });
  const timeRange = useMemo(() => ({
    from: rangeFrom,
    to: rangeTo,
  }), [rangeFrom, rangeTo]);

  const { transactionType, serviceName } =
    useBSDServiceContext();

  const history = useHistory();

  // redirect to first transaction type
  if (!transactionTypeFromUrl && transactionType) {
    replace(history, { query: { transactionType } });
  }

  const setScreenContext = useBSDPluginContext().observabilityAIAssistant?.service.setScreenContext;

  useEffect(() => {
    return setScreenContext?.({
      screenDescription: `The user is looking at the transactions overview for ${serviceName}, and the transaction type is ${transactionType}`,
    });
  }, [setScreenContext, serviceName, transactionType]);

  const dashboardSavedObjectId = "ec4243eb-df83-4242-b48c-224b70b398ce";

  return (
    <>  
    
    <BSDDeclarationCallout />
    
    <EuiSpacer size="m" />
    
    <EuiPanel hasBorder={true}>
      <DashboardRenderer
        key={`dashboard-${rangeFrom}-${rangeTo}-${serviceName}`}
        savedObjectId={dashboardSavedObjectId}
        showPlainSpinner={true}
        getCreationOptions={async (): Promise<DashboardCreationOptions> => {
          const controlGroupInput = getDefaultControlGroupInput();
          // controlGroupInputBuilder.addTimeSliderControl(controlGroupInput); // This line was removed as per the new_code
          
          // 创建 serviceName 过滤条件
          const serviceNameFilter = {
            meta: {
              index: 'bsd.analysis.metrics.anomalous.traces*',
              alias: null,
              negate: false,
              disabled: false,
              type: 'phrase',
              key: 'serviceName',
              value: serviceName,
              params: {
                query: serviceName,
                type: 'phrase'
              }
            },
            query: {
              match_phrase: {
                'serviceName': serviceName
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
              filters: [serviceNameFilter],
              query: {
                query: '',
                language: 'kuery'
              }
            }),
          };
        }}
      />
    </EuiPanel>
    
    <EuiSpacer size="m" />
    
    <EuiPanel hasBorder={true}>
      <AnomalousTracesTable
        start={start}
        end={end}
        serviceName={serviceName}
        numberOfTracesPerPage={10}
      />
    </EuiPanel>
    
    </>
  );
}

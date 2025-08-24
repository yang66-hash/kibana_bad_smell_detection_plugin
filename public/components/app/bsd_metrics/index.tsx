import React from 'react';
import { useBSDServiceContext } from '../../../context/bsd_service/use_bsd_service_context';
import { JvmMetricsOverview } from './jvm_metrics_overview';
import { JsonMetricsDashboard } from './static_dashboard';
import { hasDashboardFile } from './static_dashboard/helper';
import { useBSDDataView } from '../../../hooks/use_bsd_data_view';
import { BSDMetricsVis } from './bsd_metrics_vis';

export function BSDMetrics() {
  const { agentName, runtimeName, serverlessType } = useBSDServiceContext();
  const { dataView } = useBSDDataView();


  

  console.log(agentName,  runtimeName, serverlessType );
  const hasStaticDashboard = hasDashboardFile({
    agentName,
    runtimeName,
    serverlessType,
  });
  console.log("hasStaticDashboard:" + hasStaticDashboard);
  console.log("======dataView==============" + dataView + "=======================================");


  if (hasStaticDashboard && dataView) {
    return (
      <JsonMetricsDashboard
        agentName={agentName}
        runtimeName={runtimeName}
        serverlessType={serverlessType}
        dataView={dataView}
      />
    );
  }


  return <BSDMetricsVis />;
}

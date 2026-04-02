// /*
//  * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
//  * or more contributor license agreements. Licensed under the Elastic License
//  * 2.0; you may not use this file except in compliance with the Elastic License
//  * 2.0.
//  */
// import React from 'react';
// import { isAWSLambdaAgentName } from '../../../../common/agent_name';
// import { useBSDServiceContext } from '../../../context/bsd_service/use_bsd_service_context';
// import { useBSDParams } from '../../../hooks/use_bsd_params';
// import { ServerlessMetricsDetails } from './serverless_metrics_details';
// import { ServiceNodeMetrics } from './service_node_metrics';

// export function MetricsDetails() {
//   const {
//     path: { id },
//   } = useBSDParams('/services/{serviceName}/metrics/{id}');
//   const { serverlessType } = useBSDServiceContext();

//   if (isAWSLambdaAgentName(serverlessType)) {
//     return <ServerlessMetricsDetails serverlessId={id} />;
//   }

//   return <ServiceNodeMetrics serviceNodeName={id} />;
// }

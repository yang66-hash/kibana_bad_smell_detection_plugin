/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { AnomalyDetectorType } from '../../common/anomaly_detection/bsd_ml_detectors';
import { getPreferredServiceAnomalyTimeseries } from '../../common/anomaly_detection/get_preferred_service_anomaly_timeseries';
import { useBSDServiceContext } from '../context/bsd_service/use_bsd_service_context';
import { useEnvironmentsContext } from '../context/environments_context/use_environments_context';
import { useServiceAnomalyTimeseriesContext } from '../context/service_anomaly_timeseries/use_service_anomaly_timeseries_context';

export function usePreferredServiceAnomalyTimeseries(detectorType: AnomalyDetectorType) {
  const { allAnomalyTimeseries } = useServiceAnomalyTimeseriesContext();

  const { preferredEnvironment } = useEnvironmentsContext();

  const { fallbackToTransactions } = useBSDServiceContext();

  return getPreferredServiceAnomalyTimeseries({
    preferredEnvironment,
    fallbackToTransactions,
    detectorType,
    allAnomalyTimeseries,
  });
}

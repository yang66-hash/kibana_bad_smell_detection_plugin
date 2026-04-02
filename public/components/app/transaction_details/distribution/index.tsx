/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { XYBrushEvent } from '@elastic/charts';
import { EuiSpacer } from '@elastic/eui';
import React, { useCallback } from 'react';
import { useHistory } from 'react-router-dom';

import { ProcessorEvent } from '@kbn/observability-plugin/common';
import { useLegacyUrlParams } from '../../../../context/url_params_context/use_url_params';

import { useWaterfallFetcher } from '../use_waterfall_fetcher';
import { WaterfallWithSummary } from '../waterfall_with_summary';

import { useBSDServiceContext } from '../../../../context/bsd_service/use_bsd_service_context';
import { useAnyOfBSDParams } from '../../../../hooks/use_bsd_params';
import { useTimeRange } from '../../../../hooks/use_time_range';
import { ResettingHeightRetainer } from '../../../shared/height_retainer/resetting_height_container';
import { fromQuery, push, toQuery } from '../../../shared/links/url_helpers';
import { TransactionTab } from '../waterfall_with_summary/transaction_tabs';
import { useTransactionDistributionChartData } from './use_transaction_distribution_chart_data';
import { TraceSamplesFetchResult } from '../../../../hooks/use_transaction_trace_samples_fetcher';
import { useRequestChainFetcher } from '../../../../hooks/use_request_chain_fetcher';
import { RequestChainGraph } from '../request_chain_graph';

interface TransactionDistributionProps {
  onChartSelection: (event: XYBrushEvent) => void;
  onClearSelection: () => void;
  selection?: [number, number];
  traceSamplesFetchResult: TraceSamplesFetchResult;
}

export function TransactionDistribution({
  onChartSelection,
  onClearSelection,
  selection,
  traceSamplesFetchResult,
}: TransactionDistributionProps) {
  const { urlParams } = useLegacyUrlParams();
  const { traceId, transactionId } = urlParams;

  const {
    query: { rangeFrom, rangeTo, showCriticalPath, environment },
  } = useAnyOfBSDParams(
    '/services/{serviceName}/transactions/view'
  );

  const { start, end } = useTimeRange({ rangeFrom, rangeTo });

  const history = useHistory();
  const waterfallFetchResult = useWaterfallFetcher({
    traceId,
    transactionId,
    start,
    end,
  });
  const { waterfallItemId, detailTab } = urlParams;

  const { serviceName } = useBSDServiceContext();

  // 获取请求链路数据
  const { requestChainData, status: requestChainStatus, error: requestChainError } = useRequestChainFetcher(traceId);
  
  // 打印请求链路数据用于调试
  console.log("Request Chain Data:", requestChainData);
  console.log("Request Chain Status:", requestChainStatus);
  console.log("Request Chain Error:", requestChainError);


  const onShowCriticalPathChange = useCallback(
    (nextShowCriticalPath: boolean) => {
      push(history, {
        query: {
          showCriticalPath: nextShowCriticalPath ? 'true' : 'false',
        },
      });
    },
    [history]
  );

  const onTabClick = useCallback(
    (tab: TransactionTab) => {
      history.replace({
        ...history.location,
        search: fromQuery({
          ...toQuery(history.location.search),
          detailTab: tab,
        }),
      });
    },
    [history]
  );

  return (
    <ResettingHeightRetainer reset={!traceId}>
      <div data-test-subj="apmTransactionDistributionTabContent">
        
        {/* 请求链路图 */}
        <RequestChainGraph 
          requestChainData={requestChainData} 
          status={requestChainStatus} 
        />

        <EuiSpacer size="m" />
        
        <WaterfallWithSummary
          environment={environment}
          onSampleClick={(sample) => {
            history.push({
              ...history.location,
              search: fromQuery({
                ...toQuery(history.location.search),
                transactionId: sample.transactionId,
                traceId: sample.traceId,
              }),
            });
          }}
          onTabClick={onTabClick}
          serviceName={serviceName}
          waterfallItemId={waterfallItemId}
          detailTab={detailTab as TransactionTab | undefined}
          waterfallFetchResult={waterfallFetchResult}
          traceSamplesFetchStatus={traceSamplesFetchResult.status}
          traceSamples={traceSamplesFetchResult.data?.traceSamples}
          showCriticalPath={showCriticalPath}
          onShowCriticalPathChange={onShowCriticalPathChange}
        />
      </div>
    </ResettingHeightRetainer>
  );
}

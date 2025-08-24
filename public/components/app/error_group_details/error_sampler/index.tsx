/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
import { EuiLoadingSpinner } from '@elastic/eui';
import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { fromQuery, toQuery } from '../../../shared/links/url_helpers';
import { useAnyOfBSDParams } from '../../../../hooks/use_bsd_params';
import { FETCH_STATUS, isPending, useFetcher } from '../../../../hooks/use_fetcher';
import { useTimeRange } from '../../../../hooks/use_time_range';
import { useBSDServiceContext } from '../../../../context/bsd_service/use_bsd_service_context';
import { ErrorSampleDetails } from './error_sample_detail';
import { useBSDPluginContext } from '../../../../context/bsd_plugin/use_bsd_plugin_context';

interface Props {
  errorSampleIds: string[];
  errorSamplesFetchStatus: FETCH_STATUS;
  occurrencesCount: number;
}

export function ErrorSampler({ errorSampleIds, errorSamplesFetchStatus, occurrencesCount }: Props) {
  const history = useHistory();

  const { serviceName } = useBSDServiceContext();

  const {
    path: { groupId },
    query,
  } = useAnyOfBSDParams(
    '/services/{serviceName}/errors/{groupId}',
    '/mobile-services/{serviceName}/errors-and-crashes/errors/{groupId}',
    '/mobile-services/{serviceName}/errors-and-crashes/crashes/{groupId}'
  );

  const { observabilityAIAssistant } = useBSDPluginContext();

  const { rangeFrom, rangeTo, environment, kuery, errorId } = query;

  const { start, end } = useTimeRange({ rangeFrom, rangeTo });

  const { data: errorData, status: errorFetchStatus } = useFetcher(
    (callApmApi) => {
      if (start && end && errorId) {
        return callApmApi(
          'GET /internal/apm/services/{serviceName}/errors/{groupId}/error/{errorId}',
          {
            params: {
              path: {
                serviceName,
                groupId,
                errorId,
              },
              query: {
                environment,
                kuery,
                start,
                end,
              },
            },
          }
        );
      }
    },
    [environment, kuery, serviceName, start, end, groupId, errorId]
  );
  const onSampleClick = (sample: string) => {
    history.push({
      ...history.location,
      search: fromQuery({
        ...toQuery(history.location.search),
        errorId: sample,
      }),
    });
  };
  const loadingErrorSamplesData = isPending(errorSamplesFetchStatus);

  useEffect(() => {
    if (!errorData || !observabilityAIAssistant) {
      return;
    }
    return observabilityAIAssistant.service.setScreenContext({
      data: [
        {
          name: 'error_sample',
          description: 'The error document currently displayed',
          value: errorData,
        },
      ],
    });
  }, [observabilityAIAssistant, errorData]);

  if (loadingErrorSamplesData || !errorData) {
    return (
      <div style={{ textAlign: 'center' }}>
        <EuiLoadingSpinner size="xl" />
      </div>
    );
  }

  return (
    <ErrorSampleDetails
      onSampleClick={onSampleClick}
      errorSampleIds={errorSampleIds}
      errorSamplesFetchStatus={errorSamplesFetchStatus}
      errorData={errorData}
      errorFetchStatus={errorFetchStatus}
      occurrencesCount={occurrencesCount}
    />
  );
}

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { EuiFlexGroup, EuiFlexItem, EuiLoadingSpinner, EuiPanel } from '@elastic/eui';
import React, { ReactNode } from 'react';
import { useBSDPluginContext } from '../../../context/bsd_plugin/use_bsd_plugin_context';
import { SERVICE_MAP_TIMEOUT_ERROR } from '../../../../common/service_map';
import { FETCH_STATUS, useFetcher } from '../../../hooks/use_fetcher';
import { useLicenseContext } from '../../../context/license/use_license_context';
import { useTheme } from '../../../hooks/use_theme';
import { Controls } from './controls';
import { Cytoscape } from './cytoscape';
import { getCytoscapeDivStyle } from './cytoscape_options';
import { EmptyBanner } from './empty_banner';
import { EmptyPrompt } from './empty_prompt';
import { Popover } from './popover';
import { TimeoutPrompt } from './timeout_prompt';
import { useRefDimensions } from './use_ref_dimensions';
import { SearchBar } from '../../shared/search_bar/search_bar';
import { useServiceName } from '../../../hooks/use_service_name';
import { useBSDParams, useAnyOfBSDParams } from '../../../hooks/use_bsd_params';
import { Environment } from '../../../../common/environment_rt';
import { useTimeRange } from '../../../hooks/use_time_range';

function PromptContainer({ children }: { children: ReactNode }) {
  return (
    <>
      <SearchBar showTimeComparison />
      <EuiFlexGroup
        alignItems="center"
        justifyContent="spaceAround"
        // Set the height to give it some top margin
        style={{ height: '60vh' }}
      >
        <EuiFlexItem grow={false} style={{ width: 600, textAlign: 'center' as const }}>
          {children}
        </EuiFlexItem>
      </EuiFlexGroup>
    </>
  );
}

function LoadingSpinner() {
  return <EuiLoadingSpinner size="xl" style={{ position: 'absolute', top: '50%', left: '50%' }} />;
}

export function ServiceMapHome() {
  const {
    query: { environment, kuery, rangeFrom, rangeTo, serviceGroup },
  } = useBSDParams('/service-map');
  const { start, end } = useTimeRange({ rangeFrom, rangeTo });
  return (
    <ServiceMap
      environment={environment}
      kuery={kuery}
      start={start}
      end={end}
      serviceGroupId={serviceGroup}
    />
  );
}

export function ServiceMapServiceDetail() {
  const {
    query: { environment, kuery, rangeFrom, rangeTo },
  } = useAnyOfBSDParams(
    '/services/{serviceName}/service-map',
    '/mobile-services/{serviceName}/service-map'
  );
  const { start, end } = useTimeRange({ rangeFrom, rangeTo });
  return <ServiceMap environment={environment} kuery={kuery} start={start} end={end} />;
}

export function ServiceMap({
  environment,
  kuery,
  start,
  end,
  serviceGroupId,
}: {
  environment: Environment;
  kuery: string;
  start: string;
  end: string;
  serviceGroupId?: string;
}) {
  const theme = useTheme();
  const license = useLicenseContext();
  const serviceName = useServiceName();
  const { config } = useBSDPluginContext();

  const {
    data = { elements: [] },
    status,
    error,
  } = useFetcher(
    (callApmApi) => {
      
      
      return callApmApi('GET /internal/bsd/service-map', {
        isCachable: false,
        params: {
          query: {
            start,
            end,
            environment,
            serviceName,
            serviceGroup: serviceGroupId,
            kuery,
          },
        },
      });
    },
    [license, serviceName, environment, start, end, serviceGroupId, kuery, config.serviceMapEnabled]
  );

  const { ref, height } = useRefDimensions();

  // Temporary hack to work around bottom padding introduced by EuiPage
  const PADDING_BOTTOM = 24;
  const heightWithPadding = height - PADDING_BOTTOM;


  console.log("FETCH_STATUS.SUCCESS: ",FETCH_STATUS.SUCCESS);
  console.log("Fdata.elements.length: ",data.elements.length);
  

  if (status === FETCH_STATUS.SUCCESS && data.elements.length === 0) {
    return (
      <PromptContainer>
        <EmptyPrompt />
      </PromptContainer>
    );
  }

  if (
    status === FETCH_STATUS.FAILURE &&
    error &&
    'body' in error &&
    error.body?.statusCode === 500 &&
    error.body?.message === SERVICE_MAP_TIMEOUT_ERROR
  ) {
    return (
      <PromptContainer>
        <TimeoutPrompt isGlobalServiceMap={!serviceName} />
      </PromptContainer>
    );
  }

  return (
    <>
      <SearchBar showTimeComparison />
      <EuiPanel hasBorder={true} paddingSize="none">
        <div data-test-subj="serviceMap" style={{ height: heightWithPadding }} ref={ref}>
          <Cytoscape
            elements={data.elements}
            height={heightWithPadding}
            serviceName={serviceName}
            style={getCytoscapeDivStyle(theme, status)}
          >
            <Controls />
            {serviceName && <EmptyBanner />}
            {status === FETCH_STATUS.LOADING && <LoadingSpinner />}
            <Popover
              focusedServiceName={serviceName}
              environment={environment}
              kuery={kuery}
              start={start}
              end={end}
            />
          </Cytoscape>
        </div>
      </EuiPanel>
    </>
  );
}

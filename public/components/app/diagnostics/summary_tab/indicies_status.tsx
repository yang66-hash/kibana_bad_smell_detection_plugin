/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import React from 'react';
import { EuiLink } from '@elastic/eui';
import { isEmpty } from 'lodash';
import { useBSDParams } from '../../../../hooks/use_bsd_params';
import { FETCH_STATUS } from '../../../../hooks/use_fetcher';
import { APIReturnType } from '../../../../services/rest/create_call_bsd_api';
import { useBSDRouter } from '../../../../hooks/use_bsd_router';
import { useDiagnosticsContext } from '../context/use_diagnostics';
import { TabStatus } from './tab_status';

type DiagnosticsBundle = APIReturnType<'GET /internal/apm/diagnostics'>;

export function FieldMappingStatus() {
  const router = useBSDRouter();
  const { query } = useBSDParams('/diagnostics/*');
  const { diagnosticsBundle, status } = useDiagnosticsContext();
  const isLoading = status === FETCH_STATUS.LOADING;
  const isOk = getIsIndicesTabOk(diagnosticsBundle);

  return (
    <TabStatus isLoading={isLoading} isOk={isOk} data-test-subj="fieldMappingStatus">
      Indices
      <EuiLink
        data-test-subj="apmFieldMappingStatusSeeDetailsLink"
        href={router.link('/diagnostics/indices', { query })}
      >
        See details
      </EuiLink>
    </TabStatus>
  );
}

export function getIsIndicesTabOk(diagnosticsBundle?: DiagnosticsBundle) {
  if (!diagnosticsBundle) {
    return true;
  }

  return isEmpty(diagnosticsBundle.invalidIndices);
}

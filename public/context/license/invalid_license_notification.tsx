/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { EuiButton, EuiEmptyPrompt } from '@elastic/eui';
import React from 'react';
import { useKibanaUrl } from '../../hooks/use_kibana_url';
import { useBSDPluginContext } from '../bsd_plugin/use_bsd_plugin_context';

export function InvalidLicenseNotification() {
  const {
    plugins: { licenseManagement },
  } = useBSDPluginContext();
  const licensePageUrl = useKibanaUrl('/app/management/stack/license_management');
  const manageLicenseURL = licenseManagement?.locator
    ? licenseManagement?.locator?.useUrl({
        page: 'dashboard',
      })
    : licensePageUrl;

  return (
    <EuiEmptyPrompt
      iconType="warning"
      iconColor="warning"
      title={
        <h1>
          {'Invalid License'}
        </h1>
      }
      body={
        <p>
          {'The BSD UI is not available because your current license has expired or is no longer valid.'}
        </p>
      }
      actions={[
        <EuiButton
          data-test-subj="apmInvalidLicenseNotificationManageYourLicenseButton"
          href={manageLicenseURL}
        >
          {'Manage your license'}
        </EuiButton>,
      ]}
    />
  );
}

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
import {
  EuiButton,
  EuiButtonEmpty,
  EuiFlexGroup,
  EuiFlexItem,
  EuiPanel,
  EuiSpacer,
  EuiText,
  EuiTitle,
} from '@elastic/eui';
import { FormattedMessage } from '@kbn/i18n-react';
import { useKibana } from '@kbn/kibana-react-plugin/public';
import React, { useCallback } from 'react';
import { useBSDOnboarding } from '../../../hooks/use_bsd_onboarding';

export function BSDOnboardingCallout() {
  const { application } = useKibana().services;

  const { isBSDOnboardingDismissed, dismissBSDOnboarding } =
    useBSDOnboarding();

  const dismissOnboarding = useCallback(() => {
    dismissBSDOnboarding();
  }, [dismissBSDOnboarding]);

  const getStarted = () => {
    application?.navigateToApp('observabilityOnboarding');
  };

  return !isBSDOnboardingDismissed ? (
    <>
      <EuiPanel color="primary" data-test-subj="bsd-onboarding-callout">
        <EuiFlexGroup>
          <EuiFlexItem>
            <EuiTitle size="xxs">
              <h2>
                <FormattedMessage
                  id="bsdOnboarding"
                  defaultMessage="Data Collection and Analysis of Spring Cloud Microservices Bad Smells Based on APM."
                />
              </h2>
            </EuiTitle>
            <EuiText size="xs" color="subdued">
              <p>
                <FormattedMessage
                  id="description"
                  defaultMessage="Integerate with APM and start to analyze your microservices."
                />
              </p>
            </EuiText>
          </EuiFlexItem>
          <EuiFlexItem grow={false}>
            <EuiFlexGroup responsive={false} direction="row" alignItems="center">
              <EuiFlexItem>
                <EuiButtonEmpty
                  size="s"
                  onClick={dismissOnboarding}
                >
                  <FormattedMessage
                    id="bsdOnboarding.dismiss"
                    defaultMessage="Dismiss"
                  />
                </EuiButtonEmpty>
              </EuiFlexItem>
              <EuiFlexItem>
                <EuiButton
                  size="s"
                  onClick={getStarted}
                >
                  <FormattedMessage
                    id="bsdOnboarding.getStarted"
                    defaultMessage="Get started"
                  />
                </EuiButton>
              </EuiFlexItem>
            </EuiFlexGroup>
          </EuiFlexItem>
        </EuiFlexGroup>
      </EuiPanel>
      <EuiSpacer />
    </>
  ) : null;
}

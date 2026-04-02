
import {
  EuiButton,
  EuiFlexGroup,
  EuiFlexItem,
  EuiPanel,
  EuiSpacer,
  EuiTitle,
} from '@elastic/eui';
import { FormattedMessage } from '@kbn/i18n-react';
import { useKibana } from '@kbn/kibana-react-plugin/public';
import React from 'react';

export function BSDDeclarationCallout() {
  const { application } = useKibana().services;

  
  
  const redirectToAPM = () => {
    application?.navigateToApp('apm', {
      path: '/',
      replace: false,
    });
  };

  return (
    <>
      <EuiPanel color="primary" data-test-subj="bsd-onboarding-callout">
        <EuiFlexGroup>
          <EuiFlexItem>
            <EuiTitle size="xxs">
              <h2>
                <FormattedMessage
                  id="bsdOnboarding"
                  defaultMessage="This Plugin based on APM used to detect bad smell, mmoniting metrics, logs, traces in detail redirect to APM please."
                />
              </h2>
            </EuiTitle>
          </EuiFlexItem>
          <EuiFlexItem grow={false}>
            <EuiFlexGroup responsive={false} direction="row" alignItems="center">
              <EuiFlexItem>
                <EuiButton
                  size="s"
                  onClick={redirectToAPM}
                >
                  <FormattedMessage
                    id="bsdDeclaration.Redirect"
                    defaultMessage="Redirect to APM"
                  />
                </EuiButton>
              </EuiFlexItem>
            </EuiFlexGroup>
          </EuiFlexItem>
        </EuiFlexGroup>
      </EuiPanel>
      <EuiSpacer />
    </>);
}

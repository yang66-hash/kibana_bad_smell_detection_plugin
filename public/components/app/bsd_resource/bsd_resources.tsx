import { EuiFlexGrid, EuiFlexItem, EuiListGroup, EuiTitle } from '@elastic/eui';
import React from 'react';

export function BSDResources() {
  return (
    <EuiFlexGrid direction="row">
      <EuiFlexItem grow={false}>
        <EuiTitle size="xs">
          <h4>
            Resources
          </h4>
        </EuiTitle>
      </EuiFlexItem>
      <EuiListGroup flush listItems={resources} data-test-subj="listGroup" size="s" />
    </EuiFlexGrid>
  );
}

const resources = [
  {
    iconType: 'documents',
    label: 'Documents about APM ',
    href: 'https://www.elastic.co/guide/en/observability/8.14/apm.html',
  },
  {
    iconType: 'documents',
    label: 'Documents about APM Java Agent ',
    href: 'https://www.elastic.co/guide/en/apm/agent/java/current/intro.html',
  },
];

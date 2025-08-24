/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import React from 'react';
import { EuiLink } from '@elastic/eui';
import { useBSDPluginContext } from '../../../../../context/bsd_plugin/use_bsd_plugin_context';

interface Props {
  label: string;
}

export function Documentation({ label }: Props) {
  const { docLinks } = useBSDPluginContext().core;
  return (
    <EuiLink data-test-subj="apmCustomLinksDocumentationLink" href={docLinks.links.apm.customLinks}>
      {label}
    </EuiLink>
  );
}

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import React, { ComponentProps, ComponentType } from 'react';
import { LicensePrompt } from '.';
import {
  BSDPluginContext,
  BSDPluginContextValue,
} from '../../../context/bsd_plugin/bsd_plugin_context';

const contextMock = {
  core: { http: { basePath: { prepend: () => {} } } },
} as unknown as BSDPluginContextValue;

export default {
  title: 'shared/LicensePrompt',
  component: LicensePrompt,
  decorators: [
    (Story: ComponentType) => (
      <BSDPluginContext.Provider value={contextMock}>
        <Story />
      </BSDPluginContext.Provider>
    ),
  ],
};

export function Example({ text }: ComponentProps<typeof LicensePrompt>) {
  return <LicensePrompt text={text} />;
}
Example.args = {
  showBetaBadge: false,
  text: 'To create Feature name, you must be subscribed to an Elastic X license or above.',
} as ComponentProps<typeof LicensePrompt>;

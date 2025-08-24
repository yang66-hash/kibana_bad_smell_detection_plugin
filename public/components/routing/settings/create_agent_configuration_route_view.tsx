/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
import React from 'react';
import { AgentConfigurationPageStep } from '../../../../common/agent_configuration/constants';
import { useBSDParams } from '../../../hooks/use_bsd_params';
import { AgentConfigurationCreateEdit } from '../../app/settings/agent_configurations/agent_configuration_create_edit';

export function CreateAgentConfigurationRouteView() {
  const {
    query: { pageStep = AgentConfigurationPageStep.ChooseService },
  } = useBSDParams('/settings/agent-configuration/create');

  return <AgentConfigurationCreateEdit pageStep={pageStep} />;
}

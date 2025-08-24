/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import {  EuiFlexGroup, EuiFlexItem, EuiLink, EuiSteps, EuiText } from '@elastic/eui';
import { EuiStepInterface } from '@elastic/eui/src/components/steps/step';
import React from 'react';
import { BSDMainTemplate } from '../../routing/templates/bsd_main_template';
import { DetectionComConfigView } from '../detect_com_config_view/detection_com_config_view';

const title = "Add Detection Component"


const firstSetOfSteps: EuiStepInterface[] = [
    {
      title: 'Download component and deploy',
      children: (
        <>
        <EuiFlexGroup  direction='column' gutterSize="xs" responsive={false}>
        <EuiFlexItem>
        <EuiText>
            If you are using the bad smell detection plugin for the first time, 
        please follow the instructions to download and deploy the corresponding detection component.
        </EuiText>
        </EuiFlexItem>
        <EuiFlexItem grow={false}>
          <EuiLink
            href="https://github.com/yang66-hash/data-collector"
            target="_blank"
          >
            Go to download and deploy
          </EuiLink>
        </EuiFlexItem>
      </EuiFlexGroup>
        </>
      ),
    },
    {
      title: 'Configure Detection Component',
      children: (
        <>
        <DetectionComConfigView/>
        </>
      ),
    },
  ];
  

export function DetectComSetView() {

  return (
    <BSDMainTemplate
      pageTitle={title}
      pageSectionProps={{
        contentProps: {
        style: {
            display: 'flex',
            flexGrow: 1,
        },
        },
      }}
    >
    <EuiFlexGroup direction='column' alignItems="center" gutterSize="xs" responsive={false}>
        {/* 1. test whether detection component is  running 
            invoke API to test
        */}

        {/* if not conntection successfully, nofify user to download and apply detection component  */}
      <EuiFlexItem grow={false}>
      <EuiSteps steps={firstSetOfSteps} />
      </EuiFlexItem>

    </EuiFlexGroup>
    </BSDMainTemplate>
    
  );
}

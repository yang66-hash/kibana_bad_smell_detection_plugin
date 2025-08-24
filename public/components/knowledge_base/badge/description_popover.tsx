/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import React from 'react';

import { css } from '@emotion/react';

import {
  EuiPopover,
  EuiPopoverTitle,
  EuiText,
  EuiPopoverFooter,
  EuiFlexGroup,
  EuiFlexItem,
  EuiButton,
  EuiPopoverProps,
  useEuiTheme,
} from '@elastic/eui';

interface DescriptionPopoverProps {
  name:string;
  description:string;
  button: EuiPopoverProps['button'];
  closePopover: () => void;
  isPopoverOpen: boolean;
}

export const DescriptionPopover: React.FC<DescriptionPopoverProps> = ({
  name,
  description,
  button,
  isPopoverOpen,
  closePopover,
}) => {
  const { euiTheme } = useEuiTheme();
  return (
    <EuiPopover
      button={button}
      isOpen={isPopoverOpen}
      closePopover={closePopover}
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      <EuiPopoverTitle>
        {name?name:"NULL"}
      </EuiPopoverTitle>
      <EuiText
        grow={false}
        size="s"
        css={css`
          max-width: calc(${euiTheme.size.xl} * 10);
        `}
      >
        <p>
          {description?description:"Some error occured."}
        </p>
      </EuiText>
    </EuiPopover>
  );
};

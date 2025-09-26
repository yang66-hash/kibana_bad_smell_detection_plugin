/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
import React, { useState } from 'react';

import {
  EuiBadge,
  EuiFlexGroup,
  EuiFlexItem,
  EuiIcon,
  EuiPanel,
  EuiPopover,
  EuiText,
} from '@elastic/eui';
import { i18n } from '@kbn/i18n';


const badSmellCategoryPanels = [
  {
    description: i18n.translate(
      'plugins.badSmellDetection.badSmellCategoryBadge.sourceLabel',
      { defaultMessage: "All of this summarized by team comes from HIT." }
    ),
    icons: [<EuiIcon type="documents" />],
    id: 'data-source',
  },
  {
    description: i18n.translate(
      'plugins.badSmellDetection.badSmellCategoryBadge.detectionLabel',
      { defaultMessage: 'You can detect these bad smells in your microservice systems using this Plugin' }
    ),
    icons: [<EuiIcon type="securitySignalDetected" />, <EuiIcon type="logoElastic" />],
    id: 'detect-part',
  },
];

// export interface BadSmellDescriptionBadgeProps {
//   isSupported:boolean;
//   isDynamic:boolean;
// }

export const BadSmellDescriptionBadge: React.FC = ({
}) => {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  return (
    <EuiPopover
      button={
        <EuiBadge
          iconSide="right"
          iconType="iInCircle"
          onClick={() => setIsPopoverOpen(true)}
          onClickAriaLabel={i18n.translate(
            'plugins.badSmellDetection.badSmellCategoryBadge.ariaLabel',
            {
              defaultMessage: 'Click to open explanation popover',
            }
          )}
        >
          { 
            i18n.translate('plugins.badSmellDetection.badSmellCategoryBadge.BadgeLabel', {
            defaultMessage: 'Bad Smell Category',
          })}
        </EuiBadge>
      }
      isOpen={isPopoverOpen}
      closePopover={() => {
        setIsPopoverOpen(false);
      }}
    >
      <EuiPanel hasBorder={false} hasShadow={false}>
        <EuiFlexGroup>
          {badSmellCategoryPanels.map((panel) => {
            return (
              <EuiFlexItem grow={false} key={panel.id}>
                <EuiFlexGroup
                  direction="column"
                  alignItems="center"
                  gutterSize="s"
                  style={{ maxWidth: 240 }}
                >
                  <EuiFlexItem grow={false}>
                    <EuiFlexGroup responsive={false} gutterSize="s">
                      {panel.icons.map((icon, index) => (
                        <EuiFlexItem grow={false} key={index}>
                          {icon}
                        </EuiFlexItem>
                      ))}
                    </EuiFlexGroup>
                  </EuiFlexItem>
                  <EuiFlexItem grow={false}>
                    <EuiText size="s" grow={false} textAlign="center">
                      <p>{panel.description}</p>
                    </EuiText>
                  </EuiFlexItem>
                </EuiFlexGroup>
              </EuiFlexItem>
            );
          })}
        </EuiFlexGroup>
      </EuiPanel>
    </EuiPopover>
  );
};

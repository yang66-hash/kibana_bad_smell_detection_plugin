/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import React, { MouseEvent, useState } from 'react';

import { css } from '@emotion/react';

import {
  EuiBadge,
  EuiButtonIcon,
  EuiFlexGroup,
  EuiFlexItem,
  EuiIcon,
  EuiPanel,
  EuiText,
  EuiThemeComputed,
  EuiTitle,
  useEuiTheme,
} from '@elastic/eui';

import { i18n } from '@kbn/i18n';
import { DescriptionPopover } from './description_popover';
import { DETECTION_BETA_LABEL, DETECTION_SUPPORT_LABEL, DETECTION_INTRO_LABEL } from '../../../../common/constants';
import { IBadSmell } from '../../../../common/interfaces/interfaces';


export interface BadSmellProps {
  badSmell:IBadSmell,
  iconType: string;
  badSmellStatus: string;
  detectStatus: boolean;
  detectMethod: string;
  name: string;
  description:string;
  onBadSmellSelect: (badSmell: IBadSmell) => void;
}

const getCss = (
  euiTheme: EuiThemeComputed,
) => {
  return css`
    ${
    `box-shadow: 8px 9px 0px -1px ${euiTheme.colors.lightestShade},
      8px 9px 0px 0px ${euiTheme.colors.lightShade};`}
  `;
};

export const BadSmellCheckable: React.FC<BadSmellProps> = ({
  badSmell,
  iconType,
  badSmellStatus,
  detectStatus,
  detectMethod,
  name,
  description,
  onBadSmellSelect
}) => {
  const { euiTheme } = useEuiTheme();
  const [isIntroPopoverOpen, setIntroPopoverOpen] = useState(false);

  return (
    <EuiPanel
      onClick={() => {
        console.log("dssssssssssssssssssssssssssssssssssssssssssss");    
        onBadSmellSelect(badSmell);
      }}
      id={`checkableCard`}
      css={getCss(euiTheme)}
      hasBorder
    >
      <EuiFlexGroup>
        <EuiFlexItem grow={false}>
          {iconType ? <EuiIcon type={iconType} size="l" /> : null}
        </EuiFlexItem>
        <EuiFlexItem>
          <EuiFlexGroup direction="column" gutterSize="s">
            <EuiFlexItem>
              <EuiFlexGroup gutterSize="s" responsive={false} justifyContent="spaceAround">
                <EuiFlexItem grow>
                  <EuiFlexGroup gutterSize="s" alignItems="flexStart" responsive={false}>
                    <EuiFlexItem grow={false}>
                      {(
                        <EuiTitle size="xs">
                          <h2>{name}</h2>
                        </EuiTitle>
                      )}
                    </EuiFlexItem>

                    {(
                      <EuiFlexItem grow={false}>
                        <DescriptionPopover
                          name={name}
                          description={description}
                          button={
                            <EuiButtonIcon
                              aria-label={i18n.translate(
                                'plugins.badSmellDetection.base.openPopoverLabel',
                                {
                                  defaultMessage: 'Open introduction',
                                }
                              )}
                              iconType="questionInCircle"
                              onClick={(event: MouseEvent) => {
                                event.preventDefault();
                                event.stopPropagation();
                                setIntroPopoverOpen(!isIntroPopoverOpen);
                              }}
                            />
                          }
                          closePopover={() => setIntroPopoverOpen(false)}
                          isPopoverOpen={isIntroPopoverOpen}
                        />
                      </EuiFlexItem>
                    )}
                  </EuiFlexGroup>
                </EuiFlexItem>
              </EuiFlexGroup>
            </EuiFlexItem>
            <EuiFlexItem>
              <EuiFlexGroup direction="column" gutterSize="xs">
                <EuiFlexItem>
                  <EuiFlexGroup
                    direction="row"
                    gutterSize="s"
                    justifyContent="flexStart"
                    responsive={false}
                  >
                      <EuiFlexItem grow={false}>
                        <EuiBadge color={badSmellStatus === "Undetectable" ?  'default' :
                              detectStatus  ? 'success' : 'warning'}>
                          <EuiText size="xs" >
                            {
                              badSmellStatus === "Undetectable" ?  DETECTION_INTRO_LABEL :
                              detectStatus  ? DETECTION_SUPPORT_LABEL :
                                                            DETECTION_BETA_LABEL
                            }
                          </EuiText>
                        </EuiBadge>
                    </EuiFlexItem>
                    {detectMethod && (
                      <EuiFlexItem grow={false}>
                        <EuiBadge color="hollow">
                          <EuiText size="xs">
                            {detectMethod}
                          </EuiText>
                        </EuiBadge>
                      </EuiFlexItem>
                    )}
                  </EuiFlexGroup>
                </EuiFlexItem>
              </EuiFlexGroup>
            </EuiFlexItem>
          </EuiFlexGroup>
        </EuiFlexItem>
      </EuiFlexGroup>
    </EuiPanel>
  );
};

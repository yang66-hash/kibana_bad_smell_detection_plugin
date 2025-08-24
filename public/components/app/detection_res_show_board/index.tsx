
import React, { MouseEvent, useEffect, useState } from 'react';
import {
  EuiFlexGroup,
  EuiFlexItem,
  EuiIcon,
  EuiPanel,
  EuiPopover,
  EuiSpacer,
  EuiText,
  EuiTextColor,
  EuiTitle,
  EuiToolTip,
} from '@elastic/eui';
import { IBadSmellType } from '../../../../common/interfaces/interfaces';
import { DescriptionPopover } from '../../knowledge_base/badge/description_popover';
import { BSCateIcon } from '../../../../public/assets/external_icon';

function formatNumber(changeNum:number): string {
  return changeNum > 0 ? `+${changeNum}` : `${changeNum}`;
}
function formatPercent(changeNum: number, lastWeekNum:number): string {
  if(changeNum === 0)
    return '0%';
  let changePercent = changeNum/lastWeekNum;
  if(changePercent>0)
    return `${(changePercent*100).toFixed(2)}%`;
  else
    return `${(changePercent*100).toFixed(2)}%`
}



export interface BoardProps {
  key: number;
  badSmellType:IBadSmellType;
  iconType: string;
  thisWeekNum:number;
  twoWeekNum:number;
}

export const DetectionShowBoard: React.FC<BoardProps> = ({
  key, //equals to badSmellType.name
  badSmellType,
  iconType,
  thisWeekNum,
  twoWeekNum,
}) => {
  const lastWeekNum = twoWeekNum - thisWeekNum;
  const [changeNum,setChangeNum] = useState(0);
  useEffect(()=>{
    setChangeNum(thisWeekNum - lastWeekNum)
  },[thisWeekNum,lastWeekNum]);
  const [isIntroPopoverOpen, setIntroPopoverOpen] = useState(false);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
    return (
    <EuiPanel
      hasBorder
    >
      <EuiFlexGroup>

        <EuiFlexItem>
          <EuiFlexGroup direction="column" gutterSize="s">
            <EuiFlexItem>
              <EuiFlexGroup gutterSize="s" responsive={false} justifyContent="spaceBetween">
                <EuiFlexItem grow={false}>
                    {iconType ? <EuiIcon type={iconType} size="m" /> : null}
                </EuiFlexItem>
                <EuiFlexItem grow={false}>
                  <EuiFlexGroup gutterSize="s" alignItems="flexStart" justifyContent='spaceBetween' responsive={false}>
                    <EuiFlexItem grow={false}>
                      {(
                        <EuiTitle size="xs">
                          <h2>{badSmellType.name}</h2>
                        </EuiTitle>
                      )}
                    </EuiFlexItem>
                    {(
                      <EuiFlexItem grow={false}>
                        <DescriptionPopover
                          name={badSmellType.name}
                          description={badSmellType.description}
                          button={
                            <EuiToolTip position="top" content="Click me for introduction.">
                              <BSCateIcon
                              badSmellCate={badSmellType.name}
                              onClick={(event: MouseEvent) => {
                                event.preventDefault();
                                event.stopPropagation();
                                setIntroPopoverOpen(!isIntroPopoverOpen);
                                }}
                              >
                              </BSCateIcon>
                          </EuiToolTip>
                            
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
            <EuiSpacer size='xs'/>
            <EuiFlexItem>
              <EuiFlexGroup direction="column" gutterSize="xs">
                <EuiFlexItem>
                    <EuiFlexGroup direction='row' justifyContent='spaceBetween'>
                    <EuiFlexItem grow={false}>
                      {thisWeekNum>lastWeekNum && (
                        
                        <EuiText color="success" size='m'>
                            {formatNumber(changeNum)} ({formatPercent(changeNum,lastWeekNum)})
                        </EuiText>
                      )}
                      {thisWeekNum===lastWeekNum && (
                        
                        <EuiText color="inherit" size='m'>
                            {formatNumber(changeNum)} ({formatPercent(changeNum,lastWeekNum)})
                        </EuiText>
                      )}
                      {thisWeekNum<lastWeekNum && (
                        <EuiText color="warning" size='m'>
                            {formatNumber(changeNum)} ({formatPercent(changeNum,lastWeekNum)})
                        </EuiText>
                      )}
                    </EuiFlexItem>
                    <EuiFlexItem grow={false}>
                        {thisWeekNum>lastWeekNum && (
                          <EuiTextColor color="success">
                            <span>
                              <EuiIcon type="sortUp" /> this week
                            </span>
                          </EuiTextColor>
                        )}
                        {thisWeekNum===lastWeekNum && (
                          <EuiTextColor color="inherit">
                            <span>
                              <EuiIcon type="minus" /> this week
                            </span>
                          </EuiTextColor>
                        )}
                        {thisWeekNum < lastWeekNum && (
                          <EuiTextColor color="warning">
                            <span>
                              <EuiIcon type="sortDown" /> this week
                            </span>
                          </EuiTextColor>
                        )}

                    </EuiFlexItem>
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

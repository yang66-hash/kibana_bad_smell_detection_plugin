import React from 'react';
import type { FC } from 'react';
import {
  EuiPopover,
  EuiPopoverTitle,
  EuiSelectable,
  EuiFilterButton,
  EuiFlexGroup,
  EuiFlexItem,
  EuiText,
  EuiButtonEmpty,
  EuiTextColor,
  EuiSpacer,
  useEuiTheme,
  EuiPopoverFooter,
  EuiButton,
  EuiSelectableOption,
} from '@elastic/eui';
import type { EuiSelectableProps, ExclusiveUnion } from '@elastic/eui';
import { css } from '@emotion/react';

const selectAllBtnCSS = css`
  height: auto;
`;


interface Props {
  SelectAll: () => void;
  closePopover: () => void;
  isPopoverOpen: boolean;
  options: EuiSelectableOption[];
  onFilterButtonClick: () => void;
  onSelectChange: (updatedOptions: EuiSelectableOption[]) => void;
}

export const BSDFilterPanel: FC<Props> = ({
  isPopoverOpen,
  options,
  onFilterButtonClick,
  onSelectChange,
  closePopover,
  SelectAll,
}) => {
  const { euiTheme } = useEuiTheme();

  const popoverTitleCSS = css`
    height: ${euiTheme.size.xxxl};
  `;

  return (
    <>
      <EuiPopover
        button={
          <EuiFilterButton
            iconType="arrowDown"
            iconSide="right"
            onClick={onFilterButtonClick}
            grow
            style={{
                backgroundColor: 'rgb(249, 251, 253)',
                boxShadow: 'rgba(211, 218, 230, 0.9) 0px 0px 0px 1px inset',
                borderRadius: '6px',
            }}
          >
            Cate Filters
          </EuiFilterButton>
        }
        isOpen={isPopoverOpen}
        closePopover={closePopover}
        panelPaddingSize="none"
        anchorPosition="downCenter"
        panelProps={{ css: { width: euiTheme.base * 20 } }}
      >
        <EuiPopoverTitle paddingSize="m" css={popoverTitleCSS}>
          <EuiFlexGroup>
            <EuiFlexItem>Secondary Category</EuiFlexItem>
            <EuiFlexItem grow={false}>
                <EuiButtonEmpty flush="both" onClick={SelectAll} css={selectAllBtnCSS}>
                  Select all
                </EuiButtonEmpty>
            </EuiFlexItem>
          </EuiFlexGroup>
        </EuiPopoverTitle>
        <EuiSelectable<any>
          singleSelection={false}
          options={options}
          emptyMessage="some errors occured"
          onChange={onSelectChange}
        >
          {(list) =>list}
        </EuiSelectable>
      </EuiPopover>
    </>
  );
};

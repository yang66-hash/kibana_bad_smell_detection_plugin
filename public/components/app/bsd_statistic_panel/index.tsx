import React, { useMemo } from 'react';
import { DashboardRenderer, DashboardCreationOptions } from '@kbn/dashboard-plugin/public';
import { ViewMode } from '@kbn/embeddable-plugin/public';
import { BSDMainTemplate } from '../../routing/templates/bsd_main_template';
import { getDefaultControlGroupInput } from '@kbn/controls-plugin/common';
import { controlGroupInputBuilder } from '@kbn/controls-plugin/public';
import { EuiFlexGroup, EuiFlexItem, EuiSpacer } from '@elastic/eui';
import { SearchBar } from '../../shared/search_bar/search_bar';
import { useBSDParams } from '../../../hooks/use_bsd_params';

export const StastisticPanel = () => {
  const dashboardSavedObjectId = "eed4618b-f347-40d4-a80b-41c0625e6f2f";
  const {
    query: {
      rangeFrom,
      rangeTo,
    },
  } = useBSDParams('/statistics');

  // 使用 useMemo 确保时间范围对象稳定
  const timeRange = useMemo(() => ({
    from: rangeFrom,
    to: rangeTo,
  }), [rangeFrom, rangeTo]);

  return (
    <BSDMainTemplate
      pageTitle={"Bad Smell Detection Dashboard"}
      pageSectionProps={{
        contentProps: {
          style: {
            display: 'flex',
            flexGrow: 1,
          },
        },
      }}
    >
      <EuiFlexGroup direction="column">
        <EuiFlexItem>
          <SearchBar searchBarPlaceholder='filter data using KQL syntax'/>
        </EuiFlexItem>
        <EuiSpacer size="s" />
        <EuiFlexItem>
          <DashboardRenderer
            key={`dashboard-${rangeFrom}-${rangeTo}`}
            savedObjectId={dashboardSavedObjectId}
            showPlainSpinner={true}
            getCreationOptions={async (): Promise<DashboardCreationOptions> => {
              const controlGroupInput = getDefaultControlGroupInput();
              controlGroupInputBuilder.addTimeSliderControl(controlGroupInput);
              
              return {
                useControlGroupIntegration: true,
                getInitialInput: () => ({
                  timeRange, // 使用 memoized 的时间范围
                  viewMode: ViewMode.VIEW,
                  controlGroupInput,
                }),
              };
            }}
          />
        </EuiFlexItem>
      </EuiFlexGroup>
    </BSDMainTemplate>
  );
};
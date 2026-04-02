
import { EuiSpacer, EuiTab, EuiTabs, EuiSkeletonText } from '@elastic/eui';
import { i18n } from '@kbn/i18n';
import React from 'react';
import { Transaction } from '../../../../../typings/es_schemas/ui/transaction';
import { WaterfallContainer } from './waterfall_container';
import { IWaterfall } from './waterfall_container/waterfall/waterfall_helpers/waterfall_helpers';

export enum TransactionTab {
  timeline = 'Trace Show',
}

interface Props {
  transaction?: Transaction;
  isLoading: boolean;
  waterfall: IWaterfall;
  serviceName?: string;
  waterfallItemId?: string;
  showCriticalPath: boolean;
  onShowCriticalPathChange: (showCriticalPath: boolean) => void;
}

export function TransactionTabs({
  transaction,
  waterfall,
  isLoading,
  waterfallItemId,
  serviceName,
  showCriticalPath,
  onShowCriticalPathChange,
}: Props) {
  return (
    <>
      <EuiTabs>
        <EuiTab
          isSelected={true}
        >
          Trace in Gantt
        </EuiTab>
      </EuiTabs>

      <EuiSpacer />
      {isLoading || !transaction ? (
        <EuiSkeletonText lines={3} data-test-sub="loading-content" />
      ) : (
        <WaterfallContainer
          waterfallItemId={waterfallItemId}
          serviceName={serviceName}
          waterfall={waterfall}
          showCriticalPath={showCriticalPath}
          onShowCriticalPathChange={onShowCriticalPathChange}
        />
      )}
    </>
  );
}


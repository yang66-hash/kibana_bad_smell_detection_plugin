

import { EuiFlexGroup, EuiFlexItem, EuiTitle } from '@elastic/eui';
import { i18n } from '@kbn/i18n';
import React from 'react';
import { unifiedSearchBarPlaceholder } from '../../../../common/dependencies';
import { useBSDParams } from '../../../hooks/use_bsd_params';
import { useBSDRouter } from '../../../hooks/use_bsd_router';
import { useApmRoutePath } from '../../../hooks/use_apm_route_path';
import { useFetcher } from '../../../hooks/use_fetcher';
import { useTimeRange } from '../../../hooks/use_time_range';
import { BetaBadge } from '../../shared/beta_badge';
import { SearchBar } from '../../shared/search_bar/search_bar';
import { SpanIcon } from '../../shared/span_icon';
import { BSDMainTemplate } from './bsd_main_template';

interface Props {
  children: React.ReactNode;
}

export function DependencyDetailTemplate({ children }: Props) {
  const {
    query,
    query: { dependencyName, rangeFrom, rangeTo },
  } = useBSDParams('/dependencies');

  const router = useBSDRouter();

  const { start, end } = useTimeRange({ rangeFrom, rangeTo });

  const path = useApmRoutePath();

  const dependencyMetadataFetch = useFetcher(
    (callApmApi) => {
      if (!start || !end) {
        return;
      }

      return callApmApi('GET /internal/apm/dependencies/metadata', {
        params: {
          query: {
            dependencyName,
            start,
            end,
          },
        },
      });
    },
    [dependencyName, start, end]
  );

  const { data: { metadata } = {} } = dependencyMetadataFetch;

  const tabs = [
    {
      key: 'overview',
      href: router.link('/dependencies/overview', {
        query,
      }),
      label: i18n.translate('xpack.apm.DependencyDetailOverview.title', {
        defaultMessage: 'Overview',
      }),
      isSelected: path === '/dependencies/overview',
    },
    {
      key: 'operations',
      href: router.link('/dependencies/operations', {
        query,
      }),
      label: i18n.translate('xpack.apm.DependencyDetailOperations.title', {
        defaultMessage: 'Operations',
      }),
      isSelected: path === '/dependencies/operations' || path === '/dependencies/operation',
      append: <BetaBadge icon="beta" />,
    },
  ];

  return (
    <BSDMainTemplate
      pageHeader={{
        tabs,
        pageTitle: (
          <EuiFlexGroup alignItems="center">
            <EuiFlexItem grow={false}>
              <EuiTitle size="l">
                <h1>{dependencyName}</h1>
              </EuiTitle>
            </EuiFlexItem>
            <EuiFlexItem grow={false}>
              <SpanIcon type={metadata?.spanType} subtype={metadata?.spanSubtype} />
            </EuiFlexItem>
          </EuiFlexGroup>
        ),
      }}
    >
      <SearchBar showTimeComparison searchBarPlaceholder={unifiedSearchBarPlaceholder} />
      {children}
    </BSDMainTemplate>
  );
}

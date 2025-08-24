
import React from 'react';
import { useBSDParams } from '../../../hooks/use_bsd_params';
import { useBSDRouter } from '../../../hooks/use_bsd_router';
import { useApmRoutePath } from '../../../hooks/use_apm_route_path';
import { useTraceExplorerEnabledSetting } from '../../../hooks/use_trace_explorer_enabled_setting';
import { BSDMainTemplate } from '../../routing/templates/bsd_main_template';
import { Breadcrumb } from '../breadcrumb';

type Tab = Required<
  Required<React.ComponentProps<typeof BSDMainTemplate>>['pageHeader']
>['tabs'][number];

export function TraceOverview({ children }: { children: React.ReactElement }) {
  const isTraceExplorerEnabled = useTraceExplorerEnabledSetting();

  const router = useBSDRouter();

  const { query } = useBSDParams('/traces');

  const routePath = useApmRoutePath();

  const topTracesLink = router.link('/traces', {
    query: {
      comparisonEnabled: query.comparisonEnabled,
      environment: query.environment,
      kuery: query.kuery,
      rangeFrom: query.rangeFrom,
      rangeTo: query.rangeTo,
      offset: query.offset,
      refreshInterval: query.refreshInterval,
      refreshPaused: query.refreshPaused,
    },
  });

  const title = 'Traces';

  const tabs: Tab[] = isTraceExplorerEnabled
    ? [
        {
          href: topTracesLink,
          label: 'Top traces',
          isSelected: routePath === '/traces',
        }
      ]
    : [];

  return (
    <Breadcrumb href="/traces" title={title}>
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
        pageHeader={{
          tabs,
        }}
      >
        {children}
      </BSDMainTemplate>
    </Breadcrumb>
  );
}

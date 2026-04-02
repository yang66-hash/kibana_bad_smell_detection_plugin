import { EuiFlexGroup, EuiFlexItem, EuiPanel, EuiSpacer, EuiTitle } from '@elastic/eui';
import { i18n } from '@kbn/i18n';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useFetcher } from '../../../hooks/use_fetcher';
import { ManagedTable, TableSearchBar } from '../managed_table';
import { OverviewTableContainer } from '../overview_table_container';
import { FETCH_STATUS } from '../../../hooks/use_fetcher';
import { TransactionDetailLink } from '../links/apm/transaction_detail_link';
import { useStateDebounced } from '../../../hooks/use_debounce';
import { useBSDPluginContext } from '../../../context/bsd_plugin/use_bsd_plugin_context';
import { apmEnableTableSearchBar } from '@kbn/observability-plugin/common';

interface AnomalousTrace {
  id: string;
  startTime: string;
  endTime: string;
  traceId: string;
  apiname: string;
  chainDepth: number;
  sqlCount: number;
  totalExecTime: number;
  serviceName: string;
  language: string;
}

interface Props {
  start: string;
  end: string;
  serviceName: string;
  hideTitle?: boolean;
  numberOfTracesPerPage?: number;
}

export function AnomalousTracesTable({
  start,
  end,
  serviceName,
  hideTitle = false,
  numberOfTracesPerPage = 10,
}: Props) {
  const [renderedItems, setRenderedItems] = useState<AnomalousTrace[]>([]);
  const [searchQuery, setSearchQueryDebounced] = useStateDebounced('');
  const { core } = useBSDPluginContext();

  // 稳定化 setRenderedItems 函数
  const handleChangeRenderedItems = useCallback((items: AnomalousTrace[]) => {
    setRenderedItems(items);
  }, []);

  const { data, status } = useFetcher(
    (callBsdApi) => {
      if (!start || !end || !serviceName) {
        return Promise.resolve(undefined);
      }
      return callBsdApi('GET /internal/bsd/anomalous_traces' as any, {
        params: {
          query: {
            start,
            end,
            serviceName,
            size: 1000, // 获取更多数据用于前端过滤
          },
        },
      });
    },
    [start, end, serviceName]
  );

  // 根据搜索查询过滤数据
  const filteredData = useMemo(() => {
    if (!data?.traces || !searchQuery) {
      return data?.traces || [];
    }
    
    return data.traces.filter((trace: any) => {
      // 搜索 First Transaction (apiname)
      return trace.apiname.toLowerCase().includes(searchQuery.toLowerCase());
    });
  }, [data?.traces, searchQuery]);

  // 配置搜索栏
  const isTableSearchBarEnabled = core.uiSettings.get<boolean>(apmEnableTableSearchBar, true);
  
  const tableSearchBar: TableSearchBar<AnomalousTrace> = useMemo(() => {
    return {
      isEnabled: isTableSearchBarEnabled,
      fieldsToSearch: ['apiname'], // 搜索 First Transaction 字段
      maxCountExceeded: false,
      onChangeSearchQuery: setSearchQueryDebounced,
      placeholder: i18n.translate('xpack.apm.anomalousTracesTable.tableSearch.placeholder', {
        defaultMessage: 'Search by First Transaction',
      }),
    };
  }, [isTableSearchBarEnabled, setSearchQueryDebounced]);

  // 渲染函数
  const renderChainDepth = useCallback((depth: number) => {
    const color = depth > 5 ? '#d73a49' : depth > 3 ? '#f66a0a' : '#28a745';
    return (
      <span style={{ 
        color,
        fontWeight: 'bold'
      }}>
        {depth}
      </span>
    );
  }, []);

  const renderSqlCount = useCallback((count: number) => {
    const color = count > 10 ? '#d73a49' : count > 5 ? '#f66a0a' : '#28a745';
    return (
      <span style={{ 
        color,
        fontWeight: 'bold'
      }}>
        {count}
      </span>
    );
  }, []);

  const renderTotalExecTime = useCallback((time: number) => {
    const color = time > 10000 ? '#d73a49' : time > 5000 ? '#f66a0a' : '#28a745';
    return (
      <span style={{ 
        color,
        fontWeight: 'bold'
      }}>
        {time.toLocaleString()}
      </span>
    );
  }, []);

  const renderFirstTransaction = useCallback((apiname: string, trace: AnomalousTrace) => {
    // 从 apiname 中提取事务名称和类型
    const transactionName = apiname;
    const transactionType = 'request';
    
    return (
      <TransactionDetailLink
        serviceName={serviceName}
        transactionName={transactionName}
        transactionType={transactionType}
        traceId={trace.traceId}
        latencyAggregationType="avg"
        comparisonEnabled={false}
      >
        <code style={{ fontSize: '12px' }}>
          {apiname}
        </code>
      </TransactionDetailLink>
    );
  }, [serviceName]);

  const renderTraceId = useCallback((traceId: string, trace: AnomalousTrace) => {
    // 从 apiname 中提取事务名称和类型
    const transactionName = trace.apiname;
    const transactionType = 'request';
    
    return (
      <TransactionDetailLink
        serviceName={serviceName}
        transactionName={transactionName}
        transactionType={transactionType}
        traceId={traceId}
        latencyAggregationType="avg"
        comparisonEnabled={false}
      >
        <code style={{ fontSize: '12px' }}>
          {traceId?.substring(0, 16)}...
        </code>
      </TransactionDetailLink>
    );
  }, [serviceName]);

  const renderStartTime = useCallback((startTime: string) => {
    const date = new Date(startTime);
    return date.toLocaleString();
  }, []);

  // 稳定化列定义
  const columns = useMemo(() => [
    {
      field: 'apiname',
      name: i18n.translate('xpack.apm.anomalousTracesTable.firstTransaction', {
        defaultMessage: 'First Transaction',
      }),
      sortable: true,
      width: '200px',
      render: renderFirstTransaction,
    },
      {
        field: 'traceId',
      name: i18n.translate('xpack.apm.anomalousTracesTable.traceId', {
          defaultMessage: 'Trace ID',
        }),
        sortable: true,
        width: '200px',
      render: renderTraceId,
      },
      {
        field: 'startTime',
      name: i18n.translate('xpack.apm.anomalousTracesTable.startTime', {
          defaultMessage: 'Start Time',
        }),
        sortable: true,
        width: '180px',
      render: renderStartTime,
      },
      {
        field: 'chainDepth',
      name: i18n.translate('xpack.apm.anomalousTracesTable.chainDepth', {
          defaultMessage: 'Chain Depth',
        }),
        sortable: true,
        width: '100px',
      render: renderChainDepth,
      },
      {
        field: 'sqlCount',
      name: i18n.translate('xpack.apm.anomalousTracesTable.sqlCount', {
          defaultMessage: 'SQL Count',
        }),
        sortable: true,
        width: '100px',
      render: renderSqlCount,
      },
      {
        field: 'totalExecTime',
      name: i18n.translate('xpack.apm.anomalousTracesTable.totalExecTime', {
          defaultMessage: 'Total Exec Time (ms)',
        }),
        sortable: true,
        width: '150px',
      render: renderTotalExecTime,
    },
  ], [
    renderFirstTransaction,
    renderTraceId,
    renderStartTime,
    renderChainDepth,
    renderSqlCount,
    renderTotalExecTime,
  ]);

  const items = filteredData;

  if (status === FETCH_STATUS.LOADING) {
    return (
      <EuiPanel hasBorder={true}>
        {!hideTitle && (
          <>
            <EuiTitle size="xs">
              <h2>
                {i18n.translate('xpack.apm.anomalousTracesTable.title', {
                  defaultMessage: 'Anomalous Traces',
                })}
              </h2>
            </EuiTitle>
            <EuiSpacer size="m" />
          </>
        )}
        <div>
          {i18n.translate('xpack.apm.anomalousTracesTable.loading', {
            defaultMessage: 'Loading...',
          })}
        </div>
      </EuiPanel>
    );
  }

  if (status === FETCH_STATUS.FAILURE) {
    return (
      <EuiPanel hasBorder={true}>
        {!hideTitle && (
          <>
            <EuiTitle size="xs">
              <h2>
                {i18n.translate('xpack.apm.anomalousTracesTable.title', {
                  defaultMessage: 'Anomalous Traces',
                })}
              </h2>
            </EuiTitle>
            <EuiSpacer size="m" />
          </>
        )}
        <div>
          {i18n.translate('xpack.apm.anomalousTracesTable.error', {
            defaultMessage: 'Failed to load anomalous traces',
          })}
        </div>
      </EuiPanel>
    );
  }

  return (
    <EuiFlexGroup direction="column" gutterSize="s" data-test-subj="anomalousTracesTable">
      {!hideTitle && (
        <EuiFlexItem>
          <EuiTitle size="xs">
            <h2>
              {i18n.translate('xpack.apm.anomalousTracesTable.title', {
                defaultMessage: 'Anomalous Traces',
              })}
            </h2>
          </EuiTitle>
        </EuiFlexItem>
      )}

      <EuiFlexItem>
        <OverviewTableContainer
          isEmptyAndNotInitiated={
            items.length === 0 && status === FETCH_STATUS.NOT_INITIATED
          }
        >
          <ManagedTable
            noItemsMessage={
              status === FETCH_STATUS.LOADING
                ? i18n.translate('xpack.apm.anomalousTracesTable.loading', {
                    defaultMessage: 'Loading...',
                  })
                : i18n.translate('xpack.apm.anomalousTracesTable.noResults', {
                    defaultMessage: 'No anomalous traces found',
                  })
            }
            items={items}
            columns={columns}
            initialSortField="startTime"
            initialSortDirection="desc"
            initialPageSize={numberOfTracesPerPage}
            isLoading={status === FETCH_STATUS.LOADING}
            tableSearchBar={tableSearchBar}
            showPerPageOptions={true}
            onChangeRenderedItems={handleChangeRenderedItems}
          />
        </OverviewTableContainer>
      </EuiFlexItem>
    </EuiFlexGroup>
  );
}
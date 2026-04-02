/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { EuiPanel, EuiTitle, EuiSpacer, EuiText, EuiFlexGroup, EuiFlexItem, EuiBadge, EuiButton } from '@elastic/eui';
import { i18n } from '@kbn/i18n';
import cytoscape from 'cytoscape';
import { RequestChainResponse, RequestChainNode } from '../../../../hooks/use_request_chain_fetcher';
import { FETCH_STATUS } from '../../../../hooks/use_fetcher';
import { Cytoscape, CytoscapeContext } from './cytoscape/cytoscape';
import { getCytoscapeDivStyle } from './cytoscape/cytoscape_options';
import { useTheme } from '../../../../hooks/use_theme';
import { useRequestChainEventHandlers } from './use_request_chain_event_handlers';
import { RequestChainPopover } from './request_chain_popover';

interface Props {
  requestChainData?: RequestChainResponse;
  status: FETCH_STATUS;
}

function RequestChainGraphContent({ requestChainData, status, theme }: Props & { theme: EuiTheme }) {
  const cy = useContext(CytoscapeContext);
  const [selectedNodeData, setSelectedNodeData] = useState<any>(null);
  const [popoverPosition, setPopoverPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  // 处理节点点击事件
  const handleNodeClick = useCallback((nodeData: any) => {
    setSelectedNodeData(nodeData);
    setIsPopoverOpen(true);
  }, []);

  // 关闭 Popover
  const handleClosePopover = useCallback(() => {
    setIsPopoverOpen(false);
    setSelectedNodeData(null);
  }, []);

  // 重新居中图表
  const handleRecenter = useCallback(() => {
    if (cy) {
      cy.fit(undefined, 50); // 50 是 padding
      cy.center();
    }
  }, [cy]);

  // 使用事件处理器
  useRequestChainEventHandlers({
    cy,
    theme,
    onNodeClick: handleNodeClick,
  });

  // 监听鼠标悬停事件来更新 Popover 位置
  useEffect(() => {
    if (!cy) return;

    const updatePopoverPosition = (node: cytoscape.NodeSingular) => {
      const renderedPosition = node.renderedPosition();
      const container = cy.container();
      if (container) {
        const containerRect = container.getBoundingClientRect();
        // 计算相对于页面的位置，不需要加 scrollX/scrollY，因为使用 fixed 定位
        setPopoverPosition({
          x: renderedPosition.x + containerRect.left,
          y: renderedPosition.y + containerRect.top,
        });
      }
    };

    const mouseoverHandler = (event: cytoscape.EventObject) => {
      if (event.target.isNode()) {
        updatePopoverPosition(event.target);
        setSelectedNodeData(event.target.data());
        setIsPopoverOpen(true);
      }
    };

    const mouseoutHandler = (event: cytoscape.EventObject) => {
      if (event.target.isNode()) {
        // 延迟关闭，让用户有时间将鼠标移到 popover 上
        setTimeout(() => {
          setIsPopoverOpen(false);
          setSelectedNodeData(null);
        }, 100);
      }
    };

    // 监听视图变化事件（平移、缩放等），关闭 popover
    const viewportHandler = () => {
      setIsPopoverOpen(false);
      setSelectedNodeData(null);
    };

    cy.on('mouseover', 'node', mouseoverHandler);
    cy.on('mouseout', 'node', mouseoutHandler);
    cy.on('pan zoom', viewportHandler);

    return () => {
      cy.removeListener('mouseover', 'node', mouseoverHandler);
      cy.removeListener('mouseout', 'node', mouseoutHandler);
      cy.removeListener('pan zoom', viewportHandler);
    };
  }, [cy]);

  return (
    <>
      <RequestChainPopover
        isOpen={isPopoverOpen}
        anchorPosition={popoverPosition}
        nodeData={selectedNodeData}
        onClose={handleClosePopover}
      />
      {/* 重新居中按钮 */}
      <div
        style={{
          position: 'absolute',
          top: 10,
          right: 10,
          zIndex: 1000,
        }}
      >
        <EuiButton
          size="s"
          iconType="bullseye"
          onClick={handleRecenter}
          aria-label={i18n.translate('xpack.apm.requestChainGraph.recenterButton', {
            defaultMessage: 'Recenter graph',
          })}
        >
          {i18n.translate('xpack.apm.requestChainGraph.recenterButton', {
            defaultMessage: 'Reset View',
          })}
        </EuiButton>
      </div>
    </>
  );
}

export function RequestChainGraph({ requestChainData, status }: Props) {
  const theme = useTheme();

  // 将请求链路数据转换为 Cytoscape 元素
  const elements = useMemo(() => {
    if (!requestChainData?.found || !requestChainData.requestChain) {
      return [];
    }

    const cytoscapeElements: cytoscape.ElementDefinition[] = [];
    const processedServices = new Set<string>();

    // 递归遍历链路树，构建节点和边
    const traverseChain = (
      node: RequestChainNode,
      parentServiceName?: string
    ): void => {
      // 从完整的 serviceName 中提取实际的服务名称
      // 格式: "Java|cloud-user-service|win-20230627bhi"
      const serviceNameParts = node.serviceName.split('|');
      const actualServiceName = serviceNameParts[1] || node.serviceName;
      
      // 如果这个服务还没有处理过，添加节点
      if (!processedServices.has(actualServiceName)) {
        processedServices.add(actualServiceName);
        
        // 计算 SQL 相关信息
        const sqlCount = node.sqlModelList?.length || 0;
        const totalExecTime = node.sqlModelList?.reduce((sum, sql) => sum + sql.execTime, 0) || 0;

        // 添加服务节点
        cytoscapeElements.push({
          data: {
            id: actualServiceName,
            serviceName: actualServiceName,
            label: actualServiceName,
            apiname: node.apiname,
            containSQL: node.containSQL,
            sqlCount,
            totalExecTime
          },
        });
      }

      // 如果有父节点，添加边
      if (parentServiceName) {
        const edgeId = `${parentServiceName}~${actualServiceName}`;
        cytoscapeElements.push({
          data: {
            id: edgeId,
            source: parentServiceName,
            target: actualServiceName,
          },
        });
      }

      // 递归处理子节点
      if (node.subNodes && node.subNodes.length > 0) {
        node.subNodes.forEach((subNode) => {
          traverseChain(subNode, actualServiceName);
        });
      }
    };

    // 从根节点开始遍历
    traverseChain(requestChainData.requestChain.chain);

    return cytoscapeElements;
  }, [requestChainData]);

  if (status === FETCH_STATUS.LOADING) {
    return (
      <EuiPanel hasBorder={true}>
        <EuiText>
          {i18n.translate('xpack.apm.requestChainGraph.loading', {
            defaultMessage: 'Loading request chain...',
          })}
        </EuiText>
      </EuiPanel>
    );
  }

  if (!requestChainData?.found || elements.length === 0) {
    return (
      <EuiPanel hasBorder={true}>
        <EuiText color="subdued">
          {i18n.translate('xpack.apm.requestChainGraph.noData', {
            defaultMessage: 'No request chain data available for this trace.',
          })}
        </EuiText>
      </EuiPanel>
    );
  }

  const cytoscapeStyle = getCytoscapeDivStyle(theme, status);

  return (
    <EuiPanel hasBorder={true}>
      <EuiTitle size="xs">
        <h3>
          {i18n.translate('xpack.apm.requestChainGraph.title', {
            defaultMessage: 'Request Chain Graph',
          })}
        </h3>
      </EuiTitle>
      <EuiSpacer size="m" />
      
      {/* 显示元数据 */}
      {requestChainData.metadata && (
        <>
          <EuiFlexGroup gutterSize="s">
          <EuiFlexItem grow={false}>
              <EuiBadge color="danger">
               Cyclic Dependency
              </EuiBadge>
            </EuiFlexItem>
            <EuiFlexItem grow={false}>
              <EuiBadge color="primary">
                {i18n.translate('xpack.apm.requestChainGraph.chainDepth', {
                  defaultMessage: 'Chain Depth: {depth}',
                  values: { depth: requestChainData.metadata.chainDepth },
                })}
              </EuiBadge>
            </EuiFlexItem>
            <EuiFlexItem grow={false}>
              <EuiBadge color="warning">
                {i18n.translate('xpack.apm.requestChainGraph.sqlCount', {
                  defaultMessage: 'SQL Queries: {count}',
                  values: { count: requestChainData.metadata.sqlCount },
                })}
              </EuiBadge>
            </EuiFlexItem>
            <EuiFlexItem grow={false}>
              <EuiBadge color="warning">
                {i18n.translate('xpack.apm.requestChainGraph.totalExecTime', {
                  defaultMessage: 'Total Exec Time: {time}ms',
                  values: { time: requestChainData.metadata.totalExecTime },
                })}
              </EuiBadge>
            </EuiFlexItem>
            <EuiFlexItem grow={false}>
              <EuiBadge>
                {i18n.translate('xpack.apm.requestChainGraph.traceId', {
                  defaultMessage: 'Trace ID: {traceId}',
                  values: { traceId: requestChainData.requestChain?.traceId || 'N/A' },
                })}
              </EuiBadge>
            </EuiFlexItem>
          </EuiFlexGroup>
          <EuiSpacer size="m" />
        </>
      )}

      {/* Cytoscape 图形 */}
      <Cytoscape
        elements={elements}
        height={600}
        style={cytoscapeStyle}
      >
        <RequestChainGraphContent 
          requestChainData={requestChainData} 
          status={status} 
          theme={theme}
        />
      </Cytoscape>

      <EuiSpacer size="s" />
      
      {/* 图例 */}
      <EuiFlexGroup gutterSize="s" alignItems="center">
        <EuiFlexItem grow={false}>
          <EuiFlexGroup gutterSize="xs" alignItems="center">
            <EuiFlexItem grow={false}>
              <div
                style={{
                  width: 20,
                  height: 20,
                  backgroundColor: theme.eui.euiColorGhost,
                  border: `2px solid ${theme.eui.euiColorMediumShade}`,
                  borderRadius: '50%',
                }}
              />
            </EuiFlexItem>
            <EuiFlexItem grow={false}>
              <EuiText size="xs">
                {i18n.translate('xpack.apm.requestChainGraph.legend.service', {
                  defaultMessage: 'Service Node',
                })}
              </EuiText>
            </EuiFlexItem>
          </EuiFlexGroup>
        </EuiFlexItem>
        <EuiFlexItem grow={false}>
          <EuiText size="xs" color="subdued">
            {i18n.translate('xpack.apm.requestChainGraph.legend.hint', {
              defaultMessage: 'Drag nodes to rearrange • Scroll to zoom • Click node for details',
            })}
          </EuiText>
        </EuiFlexItem>
      </EuiFlexGroup>
    </EuiPanel>
  );
} 
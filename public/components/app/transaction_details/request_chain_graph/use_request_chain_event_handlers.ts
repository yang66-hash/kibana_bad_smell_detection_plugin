import cytoscape from 'cytoscape';
import { debounce } from 'lodash';
import { useEffect } from 'react';
import { EuiTheme } from '@kbn/kibana-react-plugin/common';

function getLayoutOptions({
  fit = false,
  nodeHeight,
  theme,
}: {
  fit?: boolean;
  nodeHeight: number;
  theme: EuiTheme;
}): cytoscape.LayoutOptions {
  // 使用 dagre 布局实现层级结构
  // @ts-expect-error dagre 特定的选项在类型定义中可能不完整
  return {
    name: 'dagre',
    fit, // 第一次渲染时 fit 为 true，确保所有节点都在视图内
    animate: true,
    animationDuration: 300,
    padding: 50, // 增加边距，确保节点不会贴边
    spacingFactor: 1.5, // 增加间距因子，让节点之间有更多空间
    nodeSep: nodeHeight * 1.5, // 增加节点间距
    edgeSep: 50, // 增加边间距
    rankSep: 150, // 增加层级间距
    rankDir: 'LR', // 从左到右横向展示
    ranker: 'network-simplex',
  };
}

function setCursor(cursor: string, event: cytoscape.EventObjectCore) {
  const container = event.cy.container();
  if (container) {
    container.style.cursor = cursor;
  }
}

function resetConnectedEdgeStyle(cytoscapeInstance: cytoscape.Core, node?: cytoscape.NodeSingular) {
  cytoscapeInstance.edges().removeClass('highlight');
  if (node) {
    node.connectedEdges().addClass('highlight');
  }
}

export function useRequestChainEventHandlers({
  cy,
  theme,
  onNodeClick,
}: {
  cy?: cytoscape.Core;
  theme: EuiTheme;
  onNodeClick?: (nodeData: any) => void;
}) {
  useEffect(() => {
    const nodeHeight = 60;

    const dataHandler: cytoscape.EventHandler = (event, fit) => {
      resetConnectedEdgeStyle(event.cy);

      // 运行布局
      event.cy
        .elements('[!hasBeenDragged]')
        .difference('node:selected')
        .layout(getLayoutOptions({ fit, nodeHeight, theme }))
        .run();
    };

    const layoutstopHandler: cytoscape.EventHandler = (event) => {
      // 布局完成后的处理
    };

    const mouseoverHandler: cytoscape.EventHandler = (event) => {
      if (event.target.isNode()) {
        setCursor('pointer', event);
        event.target.addClass('hover');
        event.target.connectedEdges().addClass('nodeHover');
      }
    };

    const mouseoutHandler: cytoscape.EventHandler = (event) => {
      setCursor('grab', event);
      event.target.removeClass('hover');
      event.target.connectedEdges().removeClass('nodeHover');
    };

    const selectHandler: cytoscape.EventHandler = (event) => {
      resetConnectedEdgeStyle(event.cy, event.target);
      
      // 触发节点点击事件
      if (onNodeClick && event.target.isNode()) {
        onNodeClick(event.target.data());
      }
    };

    const unselectHandler: cytoscape.EventHandler = (event) => {
      resetConnectedEdgeStyle(event.cy);
    };

    const dragHandler: cytoscape.EventHandler = (event) => {
      setCursor('grabbing', event);

      if (!event.target.data('hasBeenDragged')) {
        event.target.data('hasBeenDragged', true);
      }
    };

    const dragfreeHandler: cytoscape.EventHandler = (event) => {
      setCursor('pointer', event);
    };

    const tapstartHandler: cytoscape.EventHandler = (event) => {
      if (!event.target.isNode || !event.target.isNode()) {
        setCursor('grabbing', event);
      }
    };

    const tapendHandler: cytoscape.EventHandler = (event) => {
      if (!event.target.isNode || !event.target.isNode()) {
        setCursor('grab', event);
      }
    };

    if (cy) {
      cy.on('custom:data', dataHandler);
      cy.on('layoutstop', layoutstopHandler);
      cy.on('mouseover', 'edge, node', mouseoverHandler);
      cy.on('mouseout', 'edge, node', mouseoutHandler);
      cy.on('select', 'node', selectHandler);
      cy.on('unselect', 'node', unselectHandler);
      cy.on('drag', 'node', dragHandler);
      cy.on('dragfree', 'node', dragfreeHandler);
      cy.on('tapstart', tapstartHandler);
      cy.on('tapend', tapendHandler);
    }

    return () => {
      if (cy) {
        cy.removeListener('custom:data', undefined, dataHandler);
        cy.removeListener('layoutstop', undefined, layoutstopHandler);
        cy.removeListener('mouseover', 'edge, node', mouseoverHandler);
        cy.removeListener('mouseout', 'edge, node', mouseoutHandler);
        cy.removeListener('select', 'node', selectHandler);
        cy.removeListener('unselect', 'node', unselectHandler);
        cy.removeListener('drag', 'node', dragHandler);
        cy.removeListener('dragfree', 'node', dragfreeHandler);
        cy.removeListener('tapstart', undefined, tapstartHandler);
        cy.removeListener('tapend', undefined, tapendHandler);
      }
    };
  }, [cy, theme, onNodeClick]);
} 
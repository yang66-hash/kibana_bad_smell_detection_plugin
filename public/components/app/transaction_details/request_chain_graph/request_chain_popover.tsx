import React from 'react';
import {
  EuiFlexGroup,
  EuiFlexItem,
  EuiTitle,
  EuiText,
  EuiHorizontalRule,
  EuiSpacer,
  EuiCard,
} from '@elastic/eui';
import { i18n } from '@kbn/i18n';

interface Props {
  isOpen: boolean;
  anchorPosition: { x: number; y: number };
  nodeData: {
    serviceName: string;
    apiname: string;
    containSQL: boolean;
    sqlCount: number;
    totalExecTime: number;
  } | null;
  onClose: () => void;
}

export function RequestChainPopover({ isOpen, anchorPosition, nodeData, onClose }: Props) {
  if (!nodeData || !isOpen) {
    return null;
  }

  return (
    <div
      style={{
        position: 'fixed',
        left: anchorPosition.x-20,
        top: anchorPosition.y+50,
        zIndex: 9999,
        pointerEvents: 'none',
      }}
    >
      <EuiCard
        title=""
        description=""
        style={{
          minWidth: 280,
          maxWidth: 400,
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
          border: '1px solid #d3dae6',
          pointerEvents: 'auto',
        }}
      >
        <EuiFlexGroup direction="column" gutterSize="s">
          <EuiFlexItem>
            <EuiTitle size="xxs">
              <h4 style={{ wordBreak: 'break-word', margin: 0 }}>{nodeData.serviceName}</h4>
            </EuiTitle>
          </EuiFlexItem>
          
          <EuiFlexItem>
            <EuiHorizontalRule margin="xs" />
          </EuiFlexItem>

          <EuiFlexItem>
            <EuiFlexGroup direction="column" gutterSize="xs">
              <EuiFlexItem>
                <EuiText size="xs">
                  <strong>
                    {i18n.translate('xpack.apm.requestChainPopover.apiName', {
                      defaultMessage: 'API Name:',
                    })}
                  </strong>
                </EuiText>
                <EuiText size="xs" style={{ wordBreak: 'break-word', marginTop: 4 }}>
                  <code style={{ fontSize: '11px', padding: '2px 4px', backgroundColor: '#f5f7fa' }}>
                    {nodeData.apiname || 'N/A'}
                  </code>
                </EuiText>
              </EuiFlexItem>

              <EuiFlexItem>
                <EuiSpacer size="xs" />
                <EuiFlexGroup gutterSize="s" wrap>
                  <EuiFlexItem grow={false}>
                    <EuiText size="xs">
                      <strong>
                        {i18n.translate('xpack.apm.requestChainPopover.sqlQueries', {
                          defaultMessage: 'SQL:',
                        })}
                      </strong>{' '}
                      {nodeData.containSQL ? (
                        <span style={{ color: '#d73a49', fontWeight: 'bold' }}>
                          {nodeData.sqlCount} {nodeData.sqlCount === 1 ? 'query' : 'queries'}
                        </span>
                      ) : (
                        <span style={{ color: '#28a745' }}>None</span>
                      )}
                    </EuiText>
                  </EuiFlexItem>
                  
                  {nodeData.containSQL && nodeData.totalExecTime > 0 && (
                    <EuiFlexItem grow={false}>
                      <EuiText size="xs">
                        <strong>
                          {i18n.translate('xpack.apm.requestChainPopover.execTime', {
                            defaultMessage: 'Time:',
                          })}
                        </strong>{' '}
                        <span style={{ 
                          color: nodeData.totalExecTime > 5000 ? '#d73a49' : '#f66a0a',
                          fontWeight: 'bold' 
                        }}>
                          {nodeData.totalExecTime.toLocaleString()} ms
                        </span>
                      </EuiText>
                    </EuiFlexItem>
                  )}
                </EuiFlexGroup>
              </EuiFlexItem>
            </EuiFlexGroup>
          </EuiFlexItem>
        </EuiFlexGroup>
      </EuiCard>
    </div>
  );
} 
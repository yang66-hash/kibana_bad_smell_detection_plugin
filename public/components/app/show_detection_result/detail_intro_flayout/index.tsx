import React, { useState, Fragment, useMemo, useCallback, useEffect } from 'react';
import {
  EuiButton,
  EuiButtonEmpty,
  EuiCode,
  EuiCodeBlock,
  EuiComboBox,
  EuiExpression,
  EuiFlexGroup,
  EuiFlexItem,
  EuiFlyout,
  EuiFlyoutBody,
  EuiFlyoutFooter,
  EuiFlyoutHeader,
  EuiForm,
  EuiFormRow,
  EuiPopover,
  EuiSpacer,
  EuiTab,
  EuiTabs,
  EuiText,
  EuiTitle,
  EuiSuperSelect,
  useGeneratedHtmlId,
  EuiPagination,
  EuiTabbedContentProps,
  EuiTabbedContent,
  EuiButtonIcon,
  keys,
} from '@elastic/eui';
import { css } from '@emotion/react';
import { DetectionResListItem } from 'plugins/bad_smell_detection_monitor_plugin/common/interfaces/interfaces';
import { JsonCodeEditor } from '@kbn/unified-doc-viewer-plugin/public';

export function DetailIntroFlayout ({
    hit,
    hits,
    isFlyoutVisible,
    setIsFlyoutVisible,
    setExpandedDoc,
    position
}:{
    hit: DetectionResListItem;
    hits:DetectionResListItem[];
    isFlyoutVisible:boolean;
    setIsFlyoutVisible:(isFlyoutVisible:boolean)=>void;
    setExpandedDoc: (doc?: DetectionResListItem) => void;
    position:number;
}) {
  function getIndexByDocId(hits: DetectionResListItem[], id: string) {
    return hits.findIndex((h) => {
      return h.id === id;
    });
  }
  const pageCount = useMemo<number>(() => (hits ? hits.length : 0), [hits]);
  const [activePage, setActivePage] = useState(position);
  const [actualHit, setActualHit] = useState<DetectionResListItem | undefined>(hits[position]);
  useEffect(()=>{
    setActualHit(hits?.at(activePage));
  },[activePage]);

  const closeFlyout = () => setIsFlyoutVisible(false);


  const tabs: EuiTabbedContentProps['tabs'] = [
    {
      id: 'tab-1',
      name: 'JSON',
      content: (
        <EuiFlexGroup direction='column' gutterSize='s'>
            <EuiFlexItem grow={false}>
                <EuiFlexGroup justifyContent='flexEnd'>
                    <EuiButtonEmpty iconType="copyClipboard">
                        Copy to clipboard
                    </EuiButtonEmpty>
                </EuiFlexGroup>
            </EuiFlexItem>

            <EuiFlexItem grow={false}>
                <JsonCodeEditor 
                height={'600px'}
                json={JSON.parse(JSON.stringify(actualHit,null,2))}
                />
            </EuiFlexItem>
        </EuiFlexGroup>
      ),
    },
    {
      id: 'tab-2',
      name: 'VISUALIZE',
      content: (
        <Fragment>
          <EuiSpacer />
          <EuiText>
            <p>
              This part provide visualization for different bad Smells.
            </p>
          </EuiText>
        </Fragment>
      ),
    }
  ];
  let flyout;
  if (isFlyoutVisible) {
    flyout = (
      <EuiFlyout
        ownFocus
        onClose={closeFlyout}
      >
        <EuiFlyoutHeader hasBorder>
          <EuiFlexGroup
            direction="row"
            alignItems="center"
            gutterSize="m"
            responsive={false}
            wrap={true}
          >
            <EuiFlexItem grow={false}>
              <EuiTitle
                size="s"
                css={css`
                  white-space: nowrap;
                `}
              >
                <h2>Record Detail</h2>
              </EuiTitle>
            </EuiFlexItem>
            {activePage !== -1 && (
              <EuiFlexItem>
                <EuiPagination
                  aria-label='bad smell detection detail record navigation'
                  pageCount={pageCount}
                  activePage={activePage}
                  onPageClick={(activePage) => setActivePage(activePage)}
                  compressed
                />
              </EuiFlexItem>
            )}
          </EuiFlexGroup>
        </EuiFlyoutHeader>

        <EuiFlyoutBody>
            <EuiTabbedContent
                tabs={tabs}
                initialSelectedTab={tabs[0]}
            />

           
        </EuiFlyoutBody>
      </EuiFlyout>
    );
  }

 
  return (
    <div>
      {flyout}
    </div>
  );
};

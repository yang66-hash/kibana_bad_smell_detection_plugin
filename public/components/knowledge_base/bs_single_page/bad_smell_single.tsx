
import React, { ChangeEvent, useEffect, useState } from 'react';


import {
  EuiAccordion,
  EuiButton,
  EuiCard,
  EuiFieldText,
  EuiFlexGroup,
  EuiFlexItem,
  EuiForm,
  EuiFormRow,
  EuiLink,
  EuiLoadingLogo,
  EuiPageHeader,
  EuiPageTemplate,
  EuiPanel,
  EuiSpacer,
  EuiText,
  EuiTitle,
} from '@elastic/eui';

import { IBadSmell } from '../../../../common/interfaces/interfaces';
import { useKibana } from '@kbn/kibana-react-plugin/public';
import { BSDPluginStartDeps } from '../../../../public/plugin';
import { useSearchParams } from 'react-router-dom-v5-compat';
import { useBSDPluginContext } from '../../../context/bsd_plugin/use_bsd_plugin_context';
import { ROOT_PATH } from '../../routing/routes/routes';

export interface BadSmellSingleProps {
  badSmell:IBadSmell,
  onBack: ()=>void;
}

export function BadSmellSingle() {
  const {
    core: {
      application: { navigateToApp },
    },
  } = useBSDPluginContext();
  const [searchParams] = useSearchParams();
  const name = searchParams.get('name');
  console.log("name of bad  smell:" + name);

  const { services } = useKibana<BSDPluginStartDeps>();
  const { http, BSDPageTemplate } = services;
  const ObservabilityPageTemplate = BSDPageTemplate!;

  const [badSmell, setBadSmell] = useState<IBadSmell | null>(null); 
  
  const getBSData = async () => {
    try {
      console.log('Get Single BS data...');
      const response = await http?.get(`/api/bsd/single_bad_smell/${name}`);
      console.log('Fetched BS:', response.badSmell);
      setBadSmell(response.badSmell);
    } catch (e: any) {
      const errorMsg = e.response?.status
        ? `${e.response.status} ${e.message}`
        : e.message || 'Unknown error';
      console.error('Error fetching BS:', errorMsg);
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        await getBSData();
      } catch (e) {
        console.error('Error fetching data:', e);
      }
    };
    fetchData();
  }, [name]);


  const onBack = () =>{
    navigateToApp('bsd',{path:`${ROOT_PATH}`});
  }

  if (!badSmell) {
    return (
      <ObservabilityPageTemplate>
        <EuiLoadingLogo className='logo-style' logo="logoSecurity" size='xl' css />
      </ObservabilityPageTemplate>
    );
  }

  return (
    <>
      <ObservabilityPageTemplate>
        <EuiPageTemplate.Header>
          <EuiPageHeader
            pageTitle={badSmell.name}
            iconType="logoSecurity"
            description={
              <div>
                {badSmell.aliases.map((alias, index) => (
                  <div key={index}>
                    <b>Aliases {index + 1}: </b>
                    {alias}
                  </div>
                ))}
              </div>
            }
          />
        </EuiPageTemplate.Header>

        <EuiPageTemplate.Section>
          <EuiFlexItem>
            <EuiPanel>
              <EuiAccordion
                id="description"
                buttonContent={<strong style={{ fontSize: '20px' }}>Description</strong>}
                paddingSize="l"
                initialIsOpen={true}
              >
                <EuiText className="text-style">{badSmell.description}</EuiText>
              </EuiAccordion>
            </EuiPanel>
          </EuiFlexItem>
          <EuiSpacer />
          <EuiFlexItem>
            <EuiPanel>
              <EuiAccordion
                id="cause"
                buttonContent={<strong style={{ fontSize: '20px' }}>Cause</strong>}
                paddingSize="l"
              >
                <EuiText className="text-style">{badSmell.cause}</EuiText>
              </EuiAccordion>
            </EuiPanel>
          </EuiFlexItem>
          <EuiSpacer />
          <EuiFlexItem>
            <EuiPanel>
              <EuiAccordion
                id="consequences"
                buttonContent={<strong style={{ fontSize: '20px' }}>Consequences</strong>}
                paddingSize="l"
              >
                <EuiText className="text-style">{badSmell.consequences}</EuiText>
              </EuiAccordion>
            </EuiPanel>
          </EuiFlexItem>
          <EuiSpacer />
          <EuiFlexItem>
            <EuiPanel>
              <EuiAccordion
                id="detection"
                buttonContent={<strong style={{ fontSize: '20px' }}>Detection</strong>}
                paddingSize="l"
              >
                <EuiText className="text-style">{badSmell.detection}</EuiText>
              </EuiAccordion>
            </EuiPanel>
          </EuiFlexItem>
          <EuiSpacer />
          <EuiFlexItem>
            <EuiPanel>
              <EuiAccordion
                id="example"
                buttonContent={<strong style={{ fontSize: '20px' }}>Example</strong>}
                paddingSize="l"
              >
                <EuiText className="text-style">{badSmell.example}</EuiText>
              </EuiAccordion>
            </EuiPanel>
          </EuiFlexItem>
          <EuiSpacer />
          <EuiFlexItem>
            <EuiPanel>
              <EuiAccordion
                id="source"
                buttonContent={<strong style={{ fontSize: '20px' }}>Bad smell source</strong>}
                paddingSize="l"
              >
                <EuiText className="text-style">
                  {badSmell.sources.map((source, index) => (
                    <EuiFlexItem style={{ paddingBottom: 20 }} key={index}>
                      <EuiPanel>
                        <li>
                          <strong>{source.title}</strong> <br />
                          <strong>Author: </strong>
                          {source.author} <br />
                          <strong>Year: </strong>
                          {source.year} <br />
                          <strong>Journal: </strong>
                          {source.journal} <br />
                          <strong>Volume: </strong>
                          {source.volume} <br />
                          <strong>Pages: </strong>
                          {source.pages} <br />
                          <strong>DOI: </strong>
                          {source.ID} <br />
                          <strong>Publisher: </strong>
                          {source.publisher} <br />
                          <strong>ENTRYTYPE: </strong>
                          {source.ENTRYTYPE} <br />
                        </li>
                      </EuiPanel>
                    </EuiFlexItem>
                  ))}
                </EuiText>
              </EuiAccordion>
            </EuiPanel>
          </EuiFlexItem>
        </EuiPageTemplate.Section>

        <EuiPageTemplate.BottomBar paddingSize="s">
          <EuiButton onClick={onBack}>Back</EuiButton>
        </EuiPageTemplate.BottomBar>
      </ObservabilityPageTemplate>
    </>
  );
}
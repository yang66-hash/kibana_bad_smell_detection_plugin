import {  EuiFacetButton, EuiFacetGroup, EuiFieldSearch, EuiFlexGrid, EuiFlexGroup, EuiFlexItem, EuiHorizontalRule, EuiIcon, EuiPageHeader, EuiPageTemplate, EuiPanel, EuiSpacer, EuiSwitch, EuiText, EuiTitle, useEuiTheme } from '@elastic/eui';
import { css } from '@emotion/react';
import { i18n } from '@kbn/i18n';
import { useKibana } from '@kbn/kibana-react-plugin/public';
import { IBadSmell } from '../../../common/interfaces/interfaces';
import * as React from 'react';
import {  useMemo, useState } from 'react';
import { BSDPluginStartDeps } from '../../plugin';
import { BadSmellCheckable } from './badge/bad_smell_checkable';
import { BadSmellDescriptionBadge } from './badge/bad_smell_description_badge';
import { useBSDPluginContext } from '../../context/bsd_plugin/use_bsd_plugin_context';
import { useBSSetDataFetcher } from '../../hooks/use_bad_smell_fetcher';
import { useBSSetTypeDataFetcher } from '../../hooks/use_bad_smell_type_fetcher';


export const parseBadSmellFilter = (filter: string | null): string | null => {
  const temp = filter? filter:null;
  if (!temp) return null;
  else return temp;
};

export function KnowledgeBase(){
  const {BSTypeSet} =  useBSSetTypeDataFetcher();
  const {BSSet} =  useBSSetDataFetcher();
  const {
    core: {
      application: { navigateToApp },
    },
  } = useBSDPluginContext();



  const { services } = useKibana<BSDPluginStartDeps>();

  const { BSDPageTemplate} = services;
  const ObservabilityPageTemplate =  BSDPageTemplate!;
  const { euiTheme } = useEuiTheme();

  // State to store fetched data

  const [searchTerm, setSearchTerm] = useState('');

  const [badSmellFilter, setBadSmellFilter] = useState<string | null>(null);

  const filteredBadSmells = useMemo(()=>{
    console.log("Calculating filteredBadSmells...");
  console.log("BSSet:", BSSet);
  console.log("badSmellFilter:", badSmellFilter);
  console.log("searchTerm:", searchTerm);
    //filter the bad smells base on the conditions of category and name search;
    return BSSet?.filter((bs)=>badSmellFilter?bs.categoryIndex===badSmellFilter:true)
             .filter((bs)=>searchTerm? bs.name.toLocaleLowerCase().includes(searchTerm.toLocaleLowerCase()) : true);

  },[BSSet,badSmellFilter,searchTerm]);

  const handleBadSmellSelect = (bs:IBadSmell) => {
    navigateToApp('bsd',{path:`/bad_smell?name=${bs.name}`});
  };

  
  const renderBadSemllList = () => {  
    return (
      <EuiFlexGrid columns={3}>
        {filteredBadSmells?.map((bs) => (
            <EuiFlexItem key={bs.name} grow>
            <BadSmellCheckable
              badSmell={bs}
              iconType={'logoSecurity'}
              badSmellStatus={'dynamic'}
              detectStatus={'support'}
              name={bs.name}
              description={bs.description} 
              onBadSmellSelect={() => handleBadSmellSelect(bs)}
            />
          </EuiFlexItem>
        ))}
      </EuiFlexGrid>
    );
  };

  return (
    <ObservabilityPageTemplate>
    <EuiFlexGroup>
      <EuiFlexItem
        grow={false}
        css={css`
          max-width: calc(${euiTheme.size.xxl} * 5);
        `}
      >
        <EuiFlexGroup direction="column" gutterSize="none">
          <EuiFlexItem grow={false}>
            <EuiFacetGroup>
              { (
                <EuiFacetButton
                  quantity={BSSet?.length}
                  onClick={() => setBadSmellFilter(null)}
                >
                  {i18n.translate(
                    'plugins.badSmellDetection.base.knowlwdgebase.allLabel',
                    { defaultMessage: 'All bad smells' }
                  )}
                </EuiFacetButton>
              )}

              {(
                <EuiFacetButton
                  quantity={BSSet?.filter(bs=>bs.categoryIndex==='1').length}
                  onClick={() => setBadSmellFilter('1')}

                >
                  {i18n.translate(
                    'plugins.badSmellDetection.base.knowlwdgebase.APIDesignLabel',
                    {
                      defaultMessage: 'API design',
                    }
                  )}
                </EuiFacetButton>
              )}
              
              {(
                <EuiFacetButton
                  quantity={BSSet?.filter(bs=>bs.categoryIndex==='2').length}
                  onClick={() => setBadSmellFilter('2')}

                >
                  {i18n.translate(
                    'plugins.badSmellDetection.base.knowlwdgebase.ComIntLabel',
                    {
                      defaultMessage: 'Communication & Interaction',
                    }
                  )}
                </EuiFacetButton>
              )}
              
              {(
                <EuiFacetButton
                  quantity={BSSet?.filter(bs=>bs.categoryIndex==='3').length}
                  onClick={() => setBadSmellFilter('3')}

                >
                  {i18n.translate(
                    'plugins.badSmellDetection.base.knowlwdgebase.StrInfLabel',
                    {
                      defaultMessage: 'Structure & Infrastructure',
                    }
                  )}
                </EuiFacetButton>
              )}
              
              {(
                <EuiFacetButton
                  quantity={BSSet?.filter(bs=>bs.categoryIndex==='4').length}
                  onClick={() => setBadSmellFilter('4')}

                >
                  {i18n.translate(
                    'plugins.badSmellDetection.base.knowlwdgebase.DecompositionLabel',
                    {
                      defaultMessage: 'Decomposition',
                    }
                  )}
                </EuiFacetButton>
              )}
              
              {(
                <EuiFacetButton
                  quantity={BSSet?.filter(bs=>bs.categoryIndex==='5').length}
                  onClick={() => setBadSmellFilter('5')}

                >
                  {i18n.translate(
                    'plugins.badSmellDetection.base.knowlwdgebase.SecurityLabel',
                    {
                      defaultMessage: 'Security',
                    }
                  )}
                </EuiFacetButton>
              )}
              
              {(
                <EuiFacetButton
                  quantity={BSSet?.filter(bs=>bs.categoryIndex==='6').length}
                  onClick={() => setBadSmellFilter('6')}

                >
                  {i18n.translate(
                    'plugins.badSmellDetection.base.knowlwdgebase.LifeManLabel',
                    {
                      defaultMessage: 'Lifecycle Management',
                    }
                  )}
                </EuiFacetButton>
              )}
              
              {(
                <EuiFacetButton
                  quantity={BSSet?.filter(bs=>bs.categoryIndex==='7').length}
                  onClick={() => setBadSmellFilter('7')}

                >
                  {i18n.translate(
                    'plugins.badSmellDetection.base.knowlwdgebase.teamLabel',
                    {
                      defaultMessage: 'Team & Technology',
                    }
                  )}
                </EuiFacetButton>
              )}
            </EuiFacetGroup>
          </EuiFlexItem>
          <EuiFlexItem grow={false}>
            <EuiHorizontalRule margin="s" />
            <EuiSpacer size="s" />
          </EuiFlexItem>
          <EuiFlexItem grow={false}>
            <EuiHorizontalRule margin="s" />
            <EuiPanel paddingSize="s" hasShadow={false} grow={false}>
              <EuiFlexGroup gutterSize="xs" alignItems="center" responsive={false}>
                <EuiFlexItem grow={false}>
                  <EuiIcon type="logoCloud" />
                </EuiFlexItem>
                <EuiFlexItem>
                  <EuiTitle size="xs">
                    <h4>
                      {i18n.translate(
                        'plugins.badSmellDetection.badSmellCategoryLabel',
                        { defaultMessage: 'Categories' }
                      )}
                    </h4>
                  </EuiTitle>
                </EuiFlexItem>
              </EuiFlexGroup>
              <EuiSpacer size="s" />
              <BadSmellDescriptionBadge/>
              <EuiSpacer size="s" />
              <EuiText size="xs" grow={false}>
                <p>
                  {i18n.translate(
                    'plugins.badSmellDetection.p.introduction',
                    {
                      defaultMessage:
                        'All these bad smells are divided into seven categories. .........',
                    }
                  )}
                </p>
              </EuiText>
            </EuiPanel>
            <EuiSpacer size="s" />
          </EuiFlexItem>
        </EuiFlexGroup>
      </EuiFlexItem>
      <EuiFlexItem>
        <EuiFieldSearch
          aria-label={i18n.translate(
            'plugins.badSmellDetection.search.ariaLabel',
            { defaultMessage: 'Search bad smells' }
          )}
          isClearable
          onChange={(event) => setSearchTerm(event.target.value)}
          placeholder={i18n.translate(
            'plugins.badSmellDetection.search.searchPlaceholder',
            { defaultMessage: 'search here ...' }
          )}
          value={searchTerm}
          fullWidth
        />
        <EuiSpacer size="s" />
        {renderBadSemllList()}
      </EuiFlexItem>
    </EuiFlexGroup>
  </ObservabilityPageTemplate>
    
  );


};
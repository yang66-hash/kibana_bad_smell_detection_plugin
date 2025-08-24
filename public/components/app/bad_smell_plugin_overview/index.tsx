
import React from 'react';
import { BSDMainTemplate } from '../../routing/templates/bsd_main_template';
import { Breadcrumb } from '../breadcrumb';
import { BSDOnboardingCallout } from '../bsd_onboarding_callout/bsd_onboarding_callout';
import { EuiFlexGroup, EuiFlexItem, EuiHorizontalRule, EuiSpacer, EuiText } from '@elastic/eui';
import { SectionContainer } from '../../shared/sections/section_container';
import { BAD_SMELL_DETECTION_INTRODUCTION } from '../../../../common/bsd_intro_constant';
import { BSDResources } from '../bsd_resource/bsd_resources';

export function BadSmellPluginOverviewPage() {
  
  const title = 'Overview';

  return (
    <Breadcrumb href="/overview" title={title}>
      <BSDMainTemplate
        pageTitle={title}
        

      >
        <BSDOnboardingCallout/>

        <EuiFlexGroup direction="column" gutterSize="s">
        <EuiFlexItem>
          <SectionContainer
          title='What is Bad Smell?'
          initialIsOpen={false}
          >
          </SectionContainer>
        </EuiFlexItem>

        <EuiFlexItem>
          <SectionContainer
          title='What is this plugin for?'
          initialIsOpen={false}
          >
          </SectionContainer>
        </EuiFlexItem>

        <EuiFlexItem>
          <SectionContainer
          title='How to use?'
          initialIsOpen={false}
          >
            <EuiText>
              Put a architecture diagram.
            </EuiText>
          </SectionContainer>
        </EuiFlexItem>
        
        <EuiFlexItem>
          <SectionContainer
            title='A Bad Smell Knowledge base.'
            appLink={{
              href: '/app/bsd/base',
              label: 'Knowledge Base',
            }}
            initialIsOpen={false}
          >
           <EuiText>
            {BAD_SMELL_DETECTION_INTRODUCTION}
           </EuiText>
            </SectionContainer>          
        </EuiFlexItem>
        <EuiFlexItem>
        <SectionContainer
            title='Microservices Monitor'
            appLink={{
              href: '/app/bsd/services',
              label: 'services',
            }}
            initialIsOpen={false}
          >

          </SectionContainer>

        </EuiFlexItem>
        <EuiFlexItem>
        <SectionContainer
            title='Traces Monitor'
            appLink={{
              href: '/app/bsd/traces',
              label: 'traces',
            }}
            initialIsOpen={false}
          >

          </SectionContainer>

        </EuiFlexItem>
        <EuiSpacer size="s" />
      </EuiFlexGroup>
      
      <EuiHorizontalRule />

      <EuiFlexGroup>
        <EuiFlexItem>
          <EuiFlexGroup>

            <EuiFlexItem>
              <BSDResources />
            </EuiFlexItem>
          </EuiFlexGroup>
        </EuiFlexItem>
      </EuiFlexGroup>


      </BSDMainTemplate>
    </Breadcrumb>
  );
}

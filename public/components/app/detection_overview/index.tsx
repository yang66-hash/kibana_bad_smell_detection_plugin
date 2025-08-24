/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
import React, { useEffect } from 'react';
import { useBSDParams } from '../../../hooks/use_bsd_params';
import { useBSDRouter } from '../../../hooks/use_bsd_router';
import { useApmRoutePath } from '../../../hooks/use_apm_route_path';
import { BSDMainTemplate } from '../../routing/templates/bsd_main_template';
import { Breadcrumb } from '../breadcrumb';
import { getNoDetectComConfig } from '../../routing/templates/no_detect_tool_config';
import { useKibana } from '@kbn/kibana-react-plugin/public';
import { BSDPluginStartDeps } from '../../../../public/plugin';
import { EuiText } from '@elastic/eui';
import { DETECTION_URL_KEY } from '../../../../common/constants';

type Tab = Required<
  Required<React.ComponentProps<typeof BSDMainTemplate>>['pageHeader']
>['tabs'][number];


const testConnection = async (URLValue:string|null) =>{
  try {
    if(URLValue===null)
      return;
    const response = await fetch(`${URLValue}/health`);
    if (!response.ok) {
        localStorage.removeItem(DETECTION_URL_KEY);
    }
  } catch (error) {
    localStorage.removeItem(DETECTION_URL_KEY);
  }
  
}

export function DetectionOverview({ children }: { children: React.ReactElement }) {

  console.log("999999999999999999999999999999999999");
  const router = useBSDRouter();
  console.log("DetectionOverview ", router);
  const { query } = useBSDParams('/detect');
  const { services } = useKibana<BSDPluginStartDeps>();
  const { http} = services;
  const basePath = http?.basePath.get();

  const routePath = useApmRoutePath();
  const commonQuery = {
    comparisonEnabled: query.comparisonEnabled,
    environment: query.environment,
    kuery: query.kuery,
    rangeFrom: query.rangeFrom,
    rangeTo: query.rangeTo,
    offset: query.offset,
    refreshInterval: query.refreshInterval,
    refreshPaused: query.refreshPaused,
  };
  const dynamicQuery = {
    comparisonEnabled: query.comparisonEnabled,
    environment: query.environment,
    kuery: query.kuery,
    offset: query.offset,
    refreshInterval: query.refreshInterval,
    refreshPaused: query.refreshPaused,
    rangeFrom: 'now-1m',
    rangeTo: 'now',
  };
  
  const internalDesignLink = router.link('/detect/internaldesign', { query: {...commonQuery,badSmellType: "Internal Design"} });
  const comInterLink = router.link('/detect/cominter', { query: {...commonQuery,badSmellType: "Communication & Interaction"}  });
  const struInfraLink = router.link('/detect/strinfra', { query: {...commonQuery,badSmellType: "Structure & Infrastructure"}  });
  const decomposLink = router.link('/detect/decompos', { query: {...commonQuery,badSmellType: "Decomposition"}  });
  const securityLink = router.link('/detect/security', { query: {...commonQuery,badSmellType: "Security"}  });
  const lifeManLink = router.link('/detect/lifeman', { query: {...commonQuery,badSmellType: "Lifecycle Management"}  });
  const teamTechLink = router.link('/detect/teamtech', { query: {...commonQuery,badSmellType: "Team & Technology"}  });
  const dynamicLink = router.link('/detect/dynamic', { query: {...dynamicQuery,badSmellType: '',detectMethod: "dynamic"} });
  const overallDetectionLink = router.link('/detect/overall', { query: dynamicQuery});

  const noDataconfig = getNoDetectComConfig({
    basePath,
    docsLink: "https://github.com/yang66-hash",
  });

  const title = 'Detection';
  const tabs: Tab[] = [
    {
      href: overallDetectionLink,
      label: (
        <EuiText textAlign='center' style={{fontWeight:'bold'}}>
          Overall<br/>Detection
        </EuiText>
      ),
      isSelected: routePath === '/overall',
    },
    {
      href: internalDesignLink,
      label: (
        <EuiText textAlign='center' style={{fontWeight:'bold'}}>
          Internal<br/>Design
        </EuiText>
      ),
      isSelected: routePath === '/internaldesign',
    },
    {
      href: comInterLink,
      label: (
        <EuiText textAlign='center' style={{fontWeight:'bold'}}>
          Interaction&<br/>Comunication
        </EuiText>
      ),
      isSelected: routePath === '/comint',
    },
    {
      href: struInfraLink,
      label: (
        <EuiText textAlign='center' style={{fontWeight:'bold'}}>
           Structure&<br/>Infrastructure
        </EuiText>
      ),
      isSelected: routePath === '/strinf',
    },
    {
      href: decomposLink,
      label: (
        <EuiText textAlign='center' style={{fontWeight:'bold'}}>
           Decomposition
        </EuiText>
      ),
      isSelected: routePath === '/decomposition',
    },
    {
      href: securityLink,
      label: (
        <EuiText textAlign='center' style={{fontWeight:'bold'}}>
           Security
        </EuiText>
      ),      
      isSelected: routePath === '/security',
    },
    {
      href: lifeManLink,
      label: (
        <EuiText textAlign='center' style={{fontWeight:'bold'}}>
           Lifecycle<br/>Management
        </EuiText>
      ),
      isSelected: routePath === '/lifeMan',
    },
    {
      href: teamTechLink,
      label: (
        <EuiText textAlign='center' style={{fontWeight:'bold'}}>
           Team&<br/>Technology
        </EuiText>
      ),
      isSelected: routePath === '/teamtech',
    },
    {
      href: dynamicLink,
      label: (
        <EuiText textAlign='center' color={'green'} style={{fontWeight:'bold'}}>
           Runtime<br/>Detection
        </EuiText>
      ),
      isSelected: routePath === '/dynamic',
    }
  ];

  useEffect(() => {
    const URLValue = localStorage.getItem(DETECTION_URL_KEY);
    testConnection(URLValue);

    const intervalId = setInterval(() => {
        testConnection(URLValue);
    }, 300000);
    return () => {
        clearInterval(intervalId);
    };
});


  return (
    <Breadcrumb href="/detect" title={title}>
      <BSDMainTemplate
      // determine whether to access /detect based on the existence of DETECTION_URL_KEY item
        noDataConfig={localStorage.getItem(DETECTION_URL_KEY)!==null?undefined:noDataconfig}
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

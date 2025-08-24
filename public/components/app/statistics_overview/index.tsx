/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
import React, { useEffect } from 'react';
import { useBSDParams } from '../../../hooks/use_bsd_params';
import { useBSDRouter } from '../../../hooks/use_bsd_router';
import { BSDMainTemplate } from '../../routing/templates/bsd_main_template';
import { Breadcrumb } from '../breadcrumb';



export function StatisticsOverview({ children }: { children: React.ReactElement }) {

  const router = useBSDRouter();
  const { query } = useBSDParams('/statistics');
  const title = "Visualization";
  


  return (
    <Breadcrumb href="/statistics" title={title}>
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
      >
        {children}
      </BSDMainTemplate>
    </Breadcrumb>
  );
}

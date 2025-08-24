import { DetectionResProvider } from '../../../../public/hooks/use_detection_result_context';
import React from 'react';

import { Breadcrumb } from '../breadcrumb';


export function ShowDetectionResultOverview({ children }: { children: React.ReactElement }) {

  const title = "Show Detection Results"

  
  return (
    <DetectionResProvider>
      <Breadcrumb href="/display" title={title}>
      {children}
    </Breadcrumb>
    </DetectionResProvider>
    
  );
}

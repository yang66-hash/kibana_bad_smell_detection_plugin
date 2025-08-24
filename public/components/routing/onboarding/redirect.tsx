/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import React from 'react';
import { useBSDPluginContext } from '../../../context/bsd_plugin/use_bsd_plugin_context';

function TutorialRedirect() {
  const {
    config: { serverlessOnboarding },
    core: {
      application: { navigateToApp },
    },
  } = useBSDPluginContext();

  if (serverlessOnboarding) {
    navigateToApp('bsd', {
      path: '/onboarding',
      replace: true,
    });
  } else {
    navigateToApp('home', {
      path: '#/tutorial/bsd',
      replace: true,
    });
  }
  return <></>;
}

export const tutorialRedirectRoute = {
  '/tutorial': {
    element: <TutorialRedirect />,
  },
};

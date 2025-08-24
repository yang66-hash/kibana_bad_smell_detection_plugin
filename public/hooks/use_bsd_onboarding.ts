/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { useState, useCallback } from 'react';

export const LOCAL_STORAGE_DISMISS_BSD_ONBOARDING_KEY =
  'DISMISS_BSD_ONBOARDING';

export function useBSDOnboarding() {
  const dismissedBSDOnboardingLocalStorage = window.localStorage.getItem(
    LOCAL_STORAGE_DISMISS_BSD_ONBOARDING_KEY
  );
  const [isBSDOnboardingDismissed, setIsBSDOnboardingDismissed] =
    useState<boolean>(JSON.parse(dismissedBSDOnboardingLocalStorage || 'false'));

  const dismissBSDOnboarding = useCallback(() => {
    window.localStorage.setItem(LOCAL_STORAGE_DISMISS_BSD_ONBOARDING_KEY, 'true');
    setIsBSDOnboardingDismissed(true);
  }, []);

  return {
    isBSDOnboardingDismissed,
    dismissBSDOnboarding,
  };
}

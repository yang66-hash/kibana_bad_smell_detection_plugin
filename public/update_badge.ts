/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { CoreStart } from '@kbn/core/public';

export function setReadonlyBadge({ application, chrome }: CoreStart) {
  const canSave = application.capabilities.apm.save;
  const { setBadge } = chrome;
  setBadge(
    !canSave
      ? {
          text: 'Read only',
          tooltip: 'Unable to save',
          iconType: 'glasses',
        }
      : undefined
  );
}

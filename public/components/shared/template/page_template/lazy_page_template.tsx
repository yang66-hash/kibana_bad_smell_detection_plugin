/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import React from 'react';
import useObservable from 'react-use/lib/useObservable';

import type {
  BSDPageTemplateDependencies,
  WrappedPageTemplateProps,
} from './page_template';

export const LazyBSDPageTemplate = React.lazy(() => import('./page_template'));

export type LazyBSDPageTemplateProps = WrappedPageTemplateProps;

export function createLazyBSDPageTemplate({
  isSidebarEnabled$,
  ...injectedDeps
}: BSDPageTemplateDependencies) {
  return (pageTemplateProps: LazyBSDPageTemplateProps) => {
    const isSidebarEnabled = useObservable(isSidebarEnabled$);
    const { showSolutionNav: showSolutionNavProp, ...props } = pageTemplateProps;
    const showSolutionNav = !!showSolutionNavProp || isSidebarEnabled;

    return (
      <React.Suspense fallback={null}>
        <LazyBSDPageTemplate {...{ ...props, showSolutionNav }} {...injectedDeps} />
      </React.Suspense>
    );
  };
}

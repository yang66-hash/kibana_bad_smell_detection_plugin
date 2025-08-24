/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
import React from 'react';
import { useBSDPluginContext } from '../../../context/bsd_plugin/use_bsd_plugin_context';
import { useBreadcrumb } from '../../../context/breadcrumbs/use_breadcrumb';

export const Breadcrumb = ({
  title,
  href,
  children,
}: {
  title: string;
  href: string;
  children: React.ReactElement;
}) => {
  const { core } = useBSDPluginContext();
  useBreadcrumb(
    () => ({ title, href: core.http.basePath.prepend('/app/bsd' + href) }),
    [core.http.basePath, href, title]
  );

  return children;
};

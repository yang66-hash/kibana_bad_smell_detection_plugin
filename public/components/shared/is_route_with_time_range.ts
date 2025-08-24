/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
import { Location } from 'history';
import type { BSDRouter } from '../routing/bsd_route_config';

export function isRouteWithTimeRange({
  bSDRouter,
  location,
}: {
  bSDRouter: BSDRouter;
  location: Location;
}) {
  const matchingRoutes = bSDRouter.getRoutesToMatch(location.pathname);
  const matchesRoute = matchingRoutes.some((route) => {
    return (
      route.path === '/diagnostics' ||
      route.path === '/services' ||
      route.path === '/traces' ||
      route.path === '/service-map' ||
      route.path === '/dependencies' ||
      route.path === '/dependencies/inventory' ||
      route.path === '/services/{serviceName}' ||
      route.path === '/mobile-services/{serviceName}' ||
      route.path === '/service-groups' ||
      route.path === '/storage-explorer' ||
      location.pathname === '/' ||
      location.pathname === '/detect' ||
      location.pathname === '/statistics' ||
      location.pathname === ''
    );
  });

  return matchesRoute;
}

export function isRouteWithComparison({
  bSDRouter,
  location,
}: {
  bSDRouter: BSDRouter;
  location: Location;
}) {
  const matchingRoutes = bSDRouter.getRoutesToMatch(location.pathname);
  const matchesRoute = matchingRoutes.some((route) => {
    return (
      route.path === '/services' ||
      route.path === '/service-map' ||
      route.path === '/dependencies' ||
      route.path === '/dependencies/inventory' ||
      route.path === '/services/{serviceName}' ||
      route.path === '/mobile-services/{serviceName}' ||
      route.path === '/service-groups' ||
      location.pathname === '/' ||
      location.pathname === ''
    );
  });

  return matchesRoute;
}

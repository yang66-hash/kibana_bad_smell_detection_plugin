/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { EuiFlexGroup, EuiFlexItem, EuiLink } from '@elastic/eui';
import { TypeOf } from '@kbn/typed-react-router-config';
import React from 'react';
import { euiStyled } from '@kbn/kibana-react-plugin/common';
import { useBSDRouter } from '../../../hooks/use_bsd_router';
import { truncate } from '../../../utils/style';
import { BSDRoutes } from '../../routing/bsd_route_config';
import { SpanIcon } from '../span_icon';

const StyledLink = euiStyled(EuiLink)`${truncate('100%')};`;

interface Props {
  query: TypeOf<BSDRoutes, '/dependencies/overview'>['query'];
  subtype?: string;
  type?: string;
  onClick?: React.ComponentProps<typeof EuiLink>['onClick'];
}

export function DependencyLink({ query, subtype, type, onClick }: Props) {
  const { link } = useBSDRouter();

  return (
    <StyledLink
      href={link('/dependencies/overview', {
        query,
      })}
      onClick={onClick}
    >
      <EuiFlexGroup alignItems="center" gutterSize="s" responsive={false}>
        <EuiFlexItem grow={false}>
          <SpanIcon type={type} subtype={subtype} />
        </EuiFlexItem>
        <EuiFlexItem className="eui-textTruncate">
          <span className="eui-textTruncate">{query.dependencyName}</span>
        </EuiFlexItem>
      </EuiFlexGroup>
    </StyledLink>
  );
}

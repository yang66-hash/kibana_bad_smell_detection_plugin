/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
import { EuiLink } from '@elastic/eui';
import { euiStyled } from '@kbn/kibana-react-plugin/common';
import React from 'react';
import { useBSDServiceContext } from '../../../../context/bsd_service/use_bsd_service_context';
import { useBSDParams } from '../../../../hooks/use_bsd_params';
import { useBSDRouter } from '../../../../hooks/use_bsd_router';
import { truncate } from '../../../../utils/style';

const StyledLink = euiStyled(EuiLink)`${truncate('100%')};`;

interface Props {
  serverlessFunctionName: string;
  serverlessId: string;
}

export function ServerlessFunctionNameLink({ serverlessFunctionName, serverlessId }: Props) {
  const { serviceName } = useBSDServiceContext();
  const { query } = useBSDParams('/services/{serviceName}/metrics');
  const { link } = useBSDRouter();
  return (
    <StyledLink
      href={link('/services/{serviceName}/metrics/{id}', {
        path: {
          serviceName,
          id: serverlessId,
        },
        query,
      })}
    >
      {serverlessFunctionName}
    </StyledLink>
  );
}

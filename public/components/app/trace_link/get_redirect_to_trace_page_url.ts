import { format } from 'url';
import { TRACE_ID } from '../../../../common/es_fields/bsd';

export const getRedirectToTracePageUrl = ({
  traceId,
  rangeFrom,
  rangeTo,
}: {
  traceId: string;
  rangeFrom?: string;
  rangeTo?: string;
}) =>
  format({
    pathname: `/traces`,
    query: {
      kuery: `${TRACE_ID} : "${traceId}"`,
      rangeFrom,
      rangeTo,
    },
  });

import React, { FC } from 'react';
import { EuiToolTip } from '@elastic/eui';
import moment from 'moment';

type DateFormatter = (props: {
  value: number;
  children: (formattedDate: string) => JSX.Element;
}) => JSX.Element;
const DefaultDateFormatter: DateFormatter = ({ value, children }) =>
  children(new Date(value).toDateString());

export const UpdatedAtField: FC<{ dateTime?: string; DateFormatterComp?: DateFormatter }> = ({
  dateTime,
  DateFormatterComp = DefaultDateFormatter,
}) => {
  if (!dateTime) {
    return (
      <EuiToolTip
        content='Time lost'
      >
        <span>-</span>
      </EuiToolTip>
    );
  }
  const updatedAt = moment(dateTime);

  if (updatedAt.diff(moment(), 'days') > -7) {
    return (
      <DateFormatterComp value={new Date(dateTime).getTime()}>
        {(formattedDate: string) => (
          <EuiToolTip content={updatedAt.format('LL LT')}>
            <span>{formattedDate}</span>
          </EuiToolTip>
        )}
      </DateFormatterComp>
    );
  }
  return (
    <EuiToolTip content={updatedAt.format('LL LT')}>
      <span>{updatedAt.format('LL')}</span>
    </EuiToolTip>
  );
};

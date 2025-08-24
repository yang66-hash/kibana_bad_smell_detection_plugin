/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
import qs from 'query-string';
import { useHistory, useLocation } from 'react-router-dom';
import { UI_SETTINGS } from '@kbn/data-plugin/public';
import { TimePickerTimeDefaults } from '../components/shared/date_picker/typings';
import { useBSDPluginContext } from '../context/bsd_plugin/use_bsd_plugin_context';

export function useDateRangeRedirect() {
  const history = useHistory();
  const location = useLocation();
  const query = qs.parse(location.search);

  const { core, plugins } = useBSDPluginContext();

  const timePickerTimeDefaults = core.uiSettings.get<TimePickerTimeDefaults>(
    UI_SETTINGS.TIMEPICKER_TIME_DEFAULTS
  );

  const timePickerSharedState = plugins.data.query.timefilter.timefilter.getTime();

  const isDateRangeSet = 'rangeFrom' in query && 'rangeTo' in query;

  const redirect = () => {
    const nextQuery = {
      rangeFrom: timePickerSharedState.from ?? timePickerTimeDefaults.from,
      rangeTo: timePickerSharedState.to ?? timePickerTimeDefaults.to,
      ...query,
    };

    history.replace({
      ...location,
      search: qs.stringify(nextQuery),
    });
  };

  return {
    isDateRangeSet,
    redirect,
  };
}

import { DataView } from '@kbn/data-views-plugin/common';
import { i18n } from '@kbn/i18n';
import { useKibana } from '@kbn/kibana-react-plugin/public';
import { useEffect, useState } from 'react';
import { BSDPluginStartDeps } from '../plugin';
import { callBSDApi } from '../services/rest/create_call_bsd_api';

export async function getBSDDataViewIndexPattern() {
  const res = await callBSDApi('GET /internal/apm/data_view/index_pattern', {
    signal: null,
  });
  return res.apmDataViewIndexPattern;
}

export function useAdHocBSDDataView() {
  const { services, notifications } = useKibana<BSDPluginStartDeps>();
  const [dataView, setDataView] = useState<DataView | undefined>();

  useEffect(() => {
    async function fetchDataView() {
      const indexPattern = await getBSDDataViewIndexPattern();

      try {
        const displayError = false;
        return await services.dataViews.create({ title: indexPattern }, undefined, displayError);
      } catch (e) {
        const noDataScreen = e.message.includes('No matching indices found');
        if (noDataScreen) {
          return;
        }

        notifications.toasts.danger({
          title: i18n.translate('xpack.apm.data_view.creation_failed', {
            defaultMessage: 'An error occurred while creating the data view',
          }),
          body: e.message,
        });

        throw e;
      }
    }

    fetchDataView().then(setDataView);
  }, [notifications.toasts, services.dataViews]);

  return { dataView };
}

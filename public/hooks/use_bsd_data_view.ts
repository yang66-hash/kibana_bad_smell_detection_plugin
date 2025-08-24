import { DataView } from '@kbn/data-views-plugin/common';
import { useKibana } from '@kbn/kibana-react-plugin/public';
import { useEffect, useState } from 'react';
import { BSDPluginStartDeps } from '../plugin';

export function useBSDDataView() {
  const { services, notifications } = useKibana<BSDPluginStartDeps>();
  const [dataView, setDataView] = useState<DataView | undefined>();

  useEffect(() => {
    async function fetchDataView() {

      try {
        const displayError = false;
        return await services.dataViews.create({ title: "bsd.analysis.metrics.external.*" }, undefined, displayError);
      } catch (e) {
        const noDataScreen = e.message.includes('No matching indices found');
        if (noDataScreen) {
          return;
        }

        notifications.toasts.danger({
          title: 'An error occurred while creating the data view',
          body: e.message,
        });

        throw e;
      }
    }

    fetchDataView().then(setDataView);
  }, [notifications.toasts, services.dataViews]);

  return { dataView };
}

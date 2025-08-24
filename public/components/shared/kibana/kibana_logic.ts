import { kea, MakeLogicType } from 'kea';
import { ApplicationStart, ChromeBreadcrumb, ScopedHistory } from '@kbn/core/public';
import { createHref, CreateHrefOptions } from './react_router_helpers/create_href';
import { FC } from 'react';
import { HttpLogic } from './http/http_logic';

export interface KibanaValues {
  history: ScopedHistory;
  navigateToUrl(path: string, options?: CreateHrefOptions): Promise<void>;
}


export interface KibanaLogicProps {
  history: ScopedHistory;

  navigateToUrl: ApplicationStart['navigateToUrl'];
}




export const KibanaLogic = kea<MakeLogicType<KibanaValues>>({
  path: ['bad_smell_detection', 'kibana_logic'],
  reducers: ({ props }) => ({
    history: [props.history, {}],
    navigateToUrl: [
      (url: string, options?: CreateHrefOptions) => {
        const deps = { history: props.history, http: HttpLogic.values.http };
        const href = createHref(url, deps, options);
        return props.navigateToUrl(href);
      },
      {},
    ], 
  })
});


export const mountKibanaLogic = (props: KibanaLogicProps) => {
  KibanaLogic(props);
  const unmount = KibanaLogic.mount();
  return unmount;
};

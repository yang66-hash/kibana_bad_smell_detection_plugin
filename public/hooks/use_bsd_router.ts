

import { useRouter } from '@kbn/typed-react-router-config';
import { useMemo } from 'react';
import type { BSDRouter } from '../components/routing/bsd_route_config';
import { useBSDPluginContext } from '../context/bsd_plugin/use_bsd_plugin_context';


//config route of BSD plugin , add base path
export function useBSDRouter() {
  const router = useRouter();
  const { core } = useBSDPluginContext();

  return useMemo(
    () =>
      ({
        ...router,
        link: (...args: [any]) => core.http.basePath.prepend('/app/bsd' + router.link(...args)),
      } as unknown as BSDRouter), [core.http.basePath, router]
  );
}

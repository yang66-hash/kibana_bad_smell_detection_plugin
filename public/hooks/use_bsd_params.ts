
import { ValuesType } from 'utility-types';
import { TypeOf, PathsOf, useParams } from '@kbn/typed-react-router-config';
import { BSDRoutes } from '../components/routing/bsd_route_config';

// these three different functions exist purely to speed up completions from
// TypeScript. One overloaded function is expensive because of the size of the
// union type that is created.

export function useMaybeBSDParams<TPath extends PathsOf<BSDRoutes>>(
  path: TPath
): TypeOf<BSDRoutes, TPath> | undefined {
  return useParams(path, true) as TypeOf<BSDRoutes, TPath> | undefined;
}

export function useBSDParams<TPath extends PathsOf<BSDRoutes>>(
  path: TPath
): TypeOf<BSDRoutes, TPath> {
  return useParams(path)! as TypeOf<BSDRoutes, TPath>;
}

export function useAnyOfBSDParams<TPaths extends Array<PathsOf<BSDRoutes>>>(
  ...paths: TPaths
): TypeOf<BSDRoutes, ValuesType<TPaths>> {
  return useParams(...paths)! as TypeOf<BSDRoutes, ValuesType<TPaths>>;
}

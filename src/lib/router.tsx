import {
  Link as ReactRouterLink,
  Outlet,
  useLocation,
  useNavigate as useReactRouterNavigate,
  useParams,
  type LinkProps as ReactRouterLinkProps,
} from "react-router-dom";
import { forwardRef, useCallback } from "react";

type Params = Record<string, string | undefined>;
type Search = Record<string, unknown>;

type RouteOptions = {
  component?: React.ComponentType;
  head?: (context: { loaderData?: unknown; params?: Params }) => {
    meta?: Array<Record<string, unknown>>;
    links?: Array<Record<string, unknown>>;
  };
  loader?: (context: { params: Params }) => unknown;
  notFoundComponent?: React.ComponentType;
  errorComponent?: React.ComponentType<{ error: Error; reset: () => void }>;
  [key: string]: unknown;
};

export type AppRoute = RouteOptions & {
  routePath: string;
  useParams: () => Params;
  // Route loader return types vary across the existing page modules.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  useLoaderData: () => any;
  // Reserved for legacy page modules that read router context.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  useRouteContext: () => any;
};

function makeRoute(routePath: string, options: RouteOptions): AppRoute {
  const route = {
    ...options,
    routePath,
    useParams,
    useLoaderData: () => {
      const params = useParams();
      return options.loader?.({ params });
    },
    useRouteContext: () => ({}),
  } as AppRoute;
  return route;
}

export function definePage(routePath: string) {
  return (options: RouteOptions) => makeRoute(routePath, options);
}

function interpolatePath(to: string, params?: Params) {
  if (!params) return to;
  return Object.entries(params).reduce(
    (path, [key, value]) => path.replace(`$${key}`, encodeURIComponent(value ?? "")),
    to,
  );
}

type LinkProps = Omit<ReactRouterLinkProps, "to"> & {
  to: string;
  params?: Params;
};

export const Link = forwardRef<HTMLAnchorElement, LinkProps>(function Link(
  { to, params, ...props },
  ref,
) {
  return <ReactRouterLink ref={ref} to={interpolatePath(to, params)} {...props} />;
});

type NavigateOptions = {
  to: string;
  params?: Params;
  search?: Search | ((previous: Search) => Search);
  replace?: boolean;
};

export function useNavigate() {
  const navigate = useReactRouterNavigate();
  const location = useLocation();

  return useCallback(
    (options: NavigateOptions | string | number) => {
      if (typeof options === "number") {
        navigate(options);
        return;
      }
      if (typeof options === "string") {
        navigate(options);
        return;
      }

      let pathname = interpolatePath(options.to, options.params);
      if (pathname === ".") pathname = location.pathname;

      let search = location.search;
      if (options.search) {
        const previous = Object.fromEntries(new URLSearchParams(location.search));
        const next =
          typeof options.search === "function" ? options.search(previous) : options.search;
        const params = new URLSearchParams();
        Object.entries(next).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== "") params.set(key, String(value));
        });
        search = params.toString() ? `?${params.toString()}` : "";
      }

      navigate(`${pathname}${search}`, { replace: options.replace });
    },
    [location.pathname, location.search, navigate],
  );
}

export function useRouterState<T>({
  select,
}: {
  select: (state: { location: { pathname: string; search: string } }) => T;
}) {
  const location = useLocation();
  return select({ location });
}

export function useSearch() {
  const location = useLocation();
  return Object.fromEntries(new URLSearchParams(location.search));
}

export function useRouter() {
  return { invalidate: () => window.location.reload() };
}

export function notFound() {
  return new Error("Not found");
}

export { Outlet };

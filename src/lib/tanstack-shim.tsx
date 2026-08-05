import React from 'react';

export function Link({ to, href, children, className, style, onClick, ...props }: any) {
  const target = to || href || '#';
  return (
    <a href={target} className={className} style={style} onClick={onClick} {...props}>
      {children}
    </a>
  );
}

export function usePathname() {
  const [pathname, setPathname] = React.useState('');
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      setPathname(window.location.pathname);
    }
  }, []);
  return pathname;
}

export function useRouterState({ select }: any = {}) {
  const pathname = typeof window !== 'undefined' ? window.location.pathname : '';
  const state = { location: { pathname } };
  return select ? select(state) : state;
}

export function useNavigate() {
  return (opts: any) => {
    const to = typeof opts === 'string' ? opts : opts?.to;
    if (to && typeof window !== 'undefined') {
      window.location.href = to;
    }
  };
}

export function createRouteFn(_path?: string) {
  return (opts: any) => opts;
}

export const createFileRoute = createRouteFn;

export function createRootRouteWithContext() {
  return (opts: any) => opts;
}

export function createRouter() {
  return {};
}

export function useRouter() {
  return { invalidate: () => {} };
}

export function HeadContent() {
  return null;
}

export function Scripts() {
  return null;
}

export function useSearch() {
  return {};
}

export function Outlet() {
  return null;
}

export function notFound() {
  return null;
}

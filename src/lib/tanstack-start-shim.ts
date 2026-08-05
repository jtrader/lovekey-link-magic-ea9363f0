export function createServerFn(_opts?: any) {
  const builder: any = {
    inputValidator: () => builder,
    handler: (fn: any) => fn,
  };
  return builder;
}

export function useServerFn(serverFn: any) {
  return serverFn;
}

export function createStart() {
  return {};
}

export function createMiddleware() {
  return (_opts?: any) => ({
    server: (fn: any) => fn,
    client: (fn: any) => fn,
  });
}

export function getRequest() {
  return null;
}

export async function useSession<T = any>(_config?: any): Promise<{
  update: (data: Partial<T>) => Promise<void>;
  clear: () => Promise<void>;
  data?: T;
}> {
  return {
    update: async () => {},
    clear: async () => {},
  };
}

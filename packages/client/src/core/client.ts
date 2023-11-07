import { type HttpMethod, type RT } from "@rt/server";

type PathForMethod<TRoutes extends RT["routes"], TMethod extends HttpMethod> = {
  [path in keyof TRoutes]: TMethod extends keyof TRoutes[path] ? path : never;
}[keyof TRoutes] &
  string;

type InputForHandler<
  TRoutes extends RT["routes"],
  TPath extends keyof TRoutes,
  TMethod extends HttpMethod,
> = TMethod extends keyof TRoutes[TPath]
  ? TRoutes[TPath][TMethod] extends { bodySchema?: infer TSchema }
    ? TSchema
    : never
  : never;

type ReturnTypeForHandler<
  TRoutes extends RT["routes"],
  TPath extends keyof TRoutes,
  TMethod extends HttpMethod,
> = TMethod extends keyof TRoutes[TPath]
  ? TRoutes[TPath][TMethod] extends { handlerFn: (...args: any[]) => infer R }
    ? R
    : never
  : never;

type FetchResponse<TReturn> = Promise<{
  data: TReturn;
}>;

export class RTClient<TApp extends RT> {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  async fetch<TReturn>(
    url: string,
    options?: FetchRequestInit,
  ): FetchResponse<TReturn> {
    return fetch(url, options).then(async (res) => {
      switch (res.headers.get("Content-Type")?.split(";")[0]) {
        case "application/json": {
          const data = await res.json<TReturn>();
          return {
            data,
          };
        }
        default: {
          const data = (await res.text()) as TReturn;
          return {
            data,
          };
        }
      }
    });
  }

  async get<
    const TPath extends PathForMethod<TApp["routes"], "GET">,
    const TReturn extends ReturnTypeForHandler<TApp["routes"], TPath, "GET">,
  >(path: TPath) {
    return this.fetch<TReturn>(`${this.baseUrl}${path}`);
  }

  async post<
    const TPath extends PathForMethod<TApp["routes"], "POST">,
    const TReturn extends ReturnTypeForHandler<TApp["routes"], TPath, "POST">,
  >(path: TPath): FetchResponse<TReturn>;

  async post<
    const TPath extends PathForMethod<TApp["routes"], "POST">,
    const TReturn extends ReturnTypeForHandler<TApp["routes"], TPath, "POST">,
    const TBody extends InputForHandler<TApp["routes"], TPath, "POST">,
  >(path: TPath, body: TBody): FetchResponse<TReturn>;

  async post<
    const TPath extends PathForMethod<TApp["routes"], "POST">,
    const TReturn extends ReturnTypeForHandler<TApp["routes"], TPath, "POST">,
    const TBody extends InputForHandler<TApp["routes"], TPath, "POST">,
  >(path: TPath, body?: TBody) {
    const contentTypeHeader = body && { "Content-Type": "application/json" };
    return this.fetch<TReturn>(`${this.baseUrl}${path}`, {
      method: "POST",
      body: JSON.stringify(body),
      headers: { ...contentTypeHeader },
    });
  }
}

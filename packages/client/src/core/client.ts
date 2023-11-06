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

export class RTClient<TApp extends RT> {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  async get<
    const TPath extends PathForMethod<TApp["routes"], "GET">,
    const TReturn extends ReturnTypeForHandler<TApp["routes"], TPath, "GET">,
  >(path: TPath) {
    const result = await fetch(`${this.baseUrl}/${path}`);
    return result.json<TReturn>();
  }

  async post<
    const TPath extends PathForMethod<TApp["routes"], "POST">,
    const TReturn extends ReturnTypeForHandler<TApp["routes"], TPath, "POST">,
  >(path: TPath): Promise<TReturn>;

  async post<
    const TPath extends PathForMethod<TApp["routes"], "POST">,
    const TReturn extends ReturnTypeForHandler<TApp["routes"], TPath, "POST">,
    const TBody extends InputForHandler<TApp["routes"], TPath, "POST">,
  >(path: TPath, body: TBody): Promise<TReturn>;

  async post<
    const TPath extends PathForMethod<TApp["routes"], "POST">,
    const TReturn extends ReturnTypeForHandler<TApp["routes"], TPath, "POST">,
    const TBody extends InputForHandler<TApp["routes"], TPath, "POST">,
  >(path: TPath, body?: TBody) {
    const result = await fetch(`${this.baseUrl}/${path}`, {
      method: "POST",
      body: JSON.stringify(body),
      headers: { "Content-Type": "application/json" },
    });
    return result.json<TReturn>();
  }
}

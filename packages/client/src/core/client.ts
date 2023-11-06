import { type RT, type HttpMethod } from "@rt/server";

type PathForMethod<TRoutes extends RT["routes"], TMethod extends HttpMethod> = {
  [path in keyof TRoutes]: TMethod extends keyof TRoutes[path] ? path : never;
}[keyof TRoutes] &
  string;

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
}

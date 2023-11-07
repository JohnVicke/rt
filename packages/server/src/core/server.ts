import { Serve } from "bun";
import { BaseSchema } from "valibot";
import { HttpMethod } from "../schemas/http-method";
import { Handler, HandlerContext } from "./handler";

type RoutesBase = {
  [path: string]: {
    [method in HttpMethod]: Handler<any, any>;
  };
};

// biome-ignore lint/complexity/noBannedTypes: <explanation>
export class RT<TRoutes extends RoutesBase = {}> {
  routes: TRoutes;

  constructor() {
    this.routes = {} as TRoutes;
  }

  private addRouteHandler(
    path: string,
    method: HttpMethod,
    handler: Handler<any, unknown>,
  ) {
    if (!this.routes[path]) {
      this.routes[path as keyof TRoutes] = {} as any;
    }
    this.routes[path][method] = handler;
  }

  get<
    const TPath extends string,
    const THandlerFn extends (context: HandlerContext) => any,
  >(
    path: TPath,
    handler: THandlerFn,
  ): RT<
    TRoutes & {
      [p in TPath]: {
        GET: Handler<THandlerFn>;
      };
    }
  > {
    this.addRouteHandler(path, "GET", new Handler({ handler }));
    return this;
  }

  post<
    const TPath extends string,
    const THandlerFn extends (context: HandlerContext) => any,
  >(
    path: TPath,
    handler: THandlerFn,
  ): RT<
    TRoutes & {
      [p in TPath]: {
        POST: Handler<THandlerFn, unknown>;
      };
    }
  >;

  post<
    const TPath extends string,
    const THandlerFn extends (context: HandlerContext<TBodySchema>) => any,
    const TBodySchema,
  >(
    path: TPath,
    schemas: { body: BaseSchema<TBodySchema> },
    handlerFn: THandlerFn,
  ): RT<
    TRoutes & {
      [p in TPath]: {
        POST: Handler<THandlerFn, TBodySchema>;
      };
    }
  >;

  post<
    const TPath extends string,
    const THandlerFn extends (context: HandlerContext) => any,
    const TBodySchema,
  >(
    path: TPath,
    bodyOrHandler: { body: BaseSchema<TBodySchema> } | THandlerFn,
    handler?: THandlerFn,
  ): this {
    if (bodyOrHandler instanceof Function) {
      const route = new Handler({ handler: bodyOrHandler });
      this.addRouteHandler(path, "POST", route);
      return this;
    }

    // biome-ignore lint/style/noNonNullAssertion: <explanation>
    const route = new Handler({ handler: handler! });
    this.addRouteHandler(path, "POST", route);

    return this;
  }

  put() {
    return this;
  }

  fetch = async (req: Request) => {
    const reqUrl = new URL(req.url);
    const handler = this.routes[reqUrl.pathname]?.[req.method as HttpMethod];

    if (!handler) {
      return new Response("Not found", { status: 404 });
    }

    const isJson = req.headers.get("Content-Type") === "application/json";
    const body = isJson ? await req.json() : await req.text();

    return handler.run({ body, request: req });
  };

  listen(
    options: number | (Partial<Serve> & { port?: number }),
    cb?: () => void,
  ) {
    const port = typeof options === "number" ? options : options?.port ?? 3000;
    const fetch = this.fetch;

    const serve = {
      ...(typeof options !== "number" && options),
      websocket: {
        open: () => {},
        message: () => {},
      },
      fetch,
      port,
      development: true,
    } satisfies Serve;

    Bun.serve(serve);

    cb?.();
    return this;
  }
}

import { BaseSchema, safeParseAsync } from "valibot";
import { HttpMethod } from "../schemas/http-method";
import { Handler, HandlerContext } from "./handler";

type HandlerKey = `${HttpMethod}-${string}`;

export class RT {
  private routes = new Map<string, Handler<string>>();

  get<const TPath extends string>(
    path: TPath,
    handler: (context: HandlerContext) => any,
  ) {
    const key = `GET-${path}` satisfies HandlerKey;
    const route = new Handler({ path, handler });
    this.routes.set(key, route);
    return this;
  }

  post<TPath extends string>(
    path: TPath,
    handler: (context: HandlerContext) => any,
  ): this;

  post<TPath extends string, TBody>(
    path: TPath,
    schemas: { body: BaseSchema<TBody> },
    handler: (context: HandlerContext<TBody>) => any,
  ): this;

  post<Path extends string, TBody>(
    path: Path,
    bodyOrHandler:
      | { body: BaseSchema<TBody> }
      | ((context: HandlerContext) => Promise<any>),
    handler?: (context: HandlerContext<TBody>) => Promise<any>,
  ): this {
    const key = `POST-${path}` satisfies HandlerKey;

    if (bodyOrHandler instanceof Function) {
      const route = new Handler({ path, handler: bodyOrHandler });
      this.routes.set(key, route);
      return this;
    }

    const route = new Handler({
      path,
      handler: handler!,
    });

    this.routes.set(key, route);
    return this;
  }

  put() {
    return this;
  }

  async handle(req: Request) {
    const method = await safeParseAsync(HttpMethod, req.method);

    if (!method.success) {
      return new Response("invalid method", { status: 400 });
    }

    const url = new URL(req.url);

    const key = `${method.output}-${url.pathname}` satisfies HandlerKey;

    if (!this.routes.has(key)) {
      return new Response("not found", { status: 404 });
    }

    const handler = this.routes.get(key)!;

    const isJson = req.headers.get("Content-Type") === "application/json";
    const body = isJson ? await req.json() : await req.text();

    return handler.run({ request: req, body });
  }

  listen(port = 3000, options?: { development?: boolean }) {
    const handler = this.handle;
    Bun.serve({
      port,
      development: options?.development,
      async fetch(req) {
        return handler(req);
      },
    });
  }
}

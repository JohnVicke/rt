import { object, safeParseAsync, string } from "valibot";
import { HttpMethod } from "../schemas/http-method";
import { RTRoute } from "./route";
import { RTRouter } from "./router";

type RouterInit = Record<PropertyKey, RTRoute<any>>;

export class RTServer<TCtx = unknown> {
  private ctx: TCtx;

  constructor(ctx: TCtx) {
    this.ctx = ctx;
  }

  router(routerInit: RouterInit) {
    return new RTRouter(routerInit);
  }

  get GET() {
    return new RTRoute(this.ctx);
  }

  get POST() {
    return new RTRoute(this.ctx);
  }

  get PUT() {
    return new RTRoute(this.ctx);
  }

  listen(port = 3000, options?: { development?: boolean }) {
    Bun.serve({
      port,
      development: options?.development,
      async fetch(req) {
        const url = new URL(req.url);
        const method = await safeParseAsync(HttpMethod, req.method);

        if (!method.success) {
          return new Response("invalid method", { status: 400 });
        }

        return new Response("not found", { status: 404 });
      },
    });
  }
}

const initRTServer = () => {
  const init = {
    context: <TCtx>(ctx: TCtx) => {
      return { create: () => new RTServer(ctx) };
    },
    create: <TCtx>(ctx?: TCtx) => {
      return new RTServer(ctx);
    },
  };
  return init;
};

const rt = initRTServer().context({ user: "hello" }).create();

rt.router({
  "/": rt.GET.body(object({ name: string() })).handler(
    ({ ctx, params, body }) => {
      return new Response();
    },
  ),
});

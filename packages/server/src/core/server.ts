import { safeParseAsync } from "valibot";
import { HttpMethod } from "../schemas/http-method";
import { RTRoute } from "./route";
import { RTRouter } from "./router";

export class RTServer {
  private static server?: RTServer;

  constructor() {
    if (RTServer.server) {
      throw new Error("RTServer already exists");
    }
    RTServer.server = this;
  }

  static get instance() {
    if (!RTServer.server) {
      RTServer.server = new RTServer();
    }
    return RTServer.server;
  }

  router(routerInit: Record<PropertyKey, RTRoute<any>>) {
    return new RTRouter(routerInit);
  }

  get() {
    return new RTRoute();
  }

  post() {
    return new RTRoute();
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

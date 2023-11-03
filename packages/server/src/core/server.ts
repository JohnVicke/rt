import { object, safeParseAsync, string } from "valibot";
import { HttpMethod } from "../schemas/http-method";
import { RTRouter } from "..";
import { RTRoute } from "./router";

export class RTServer {
  private static server?: RTServer;
  private ctx: Record<PropertyKey, any>;

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

  listen(port?: number) {
    Bun.serve({
      port,
      development: Bun.env.NODE_ENV === "development",
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

const rt = new RTServer();

const inputSchema = object({ name: string(), test: string() });

const router = rt.router({
  "/": rt
    .get()
    .input(inputSchema)
    .handler(({ input }) => {
      return new Response();
    }),
  "/user": rt.post().handler(() => {
    return new Response();
  }),
});

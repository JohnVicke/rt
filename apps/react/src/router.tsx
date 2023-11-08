import { Route, RootRoute, Router } from "@tanstack/react-router";
import { Root } from "./routes/root";
import { Home } from "./routes/home";
import { client } from "./api";

const rootRoute = new RootRoute({
  component: Root,
});

const homeRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "/",
  load: async () => {
    const res = await client.get("/hello");
    return res;
  },
  component: Home,
});

const routeTree = rootRoute.addChildren([homeRoute]);

export const router = new Router({ routeTree });

declare module "@tanstack/react-router" {
  interface Router {
    router: typeof router;
  }
}

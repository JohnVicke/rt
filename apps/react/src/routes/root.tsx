import { Link, Outlet } from "@tanstack/react-router";
import React from "react";

const TanstackRouterDevTools =
  process.env.NODE_ENV === "production"
    ? () => null
    : React.lazy(() =>
        import("@tanstack/router-devtools").then((res) => ({
          default: res.TanStackRouterDevtools,
        })),
      );

export function Root() {
  return (
    <>
      <div>
        <Link href="/">Home</Link>
        <Outlet />
      </div>
      <TanstackRouterDevTools />
    </>
  );
}

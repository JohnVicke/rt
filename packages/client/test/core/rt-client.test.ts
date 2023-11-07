import { describe, it } from "bun:test";
import { RT } from "@rt/server";
import { expectTypeOf } from "expect-type";
import { object, string } from "valibot";
import { RTClient } from "../../src";

describe("RTClient", () => {
  const app = new RT()
    .get("/", () => "hello world")
    .post("/hello", { body: object({ name: string() }) }, (ctx) => {
      return { name: ctx.body.name };
    })
    .post("/test", (ctx) => {
      return "no body";
    });

  it("infers return type for get", async () => {
    const client = new RTClient<typeof app>("http://localhost:3000");
    expectTypeOf(client.get("/")).toEqualTypeOf<Promise<string>>();
  });

  it("infers return type for post", async () => {
    const client = new RTClient<typeof app>("http://localhost:3000");
    expectTypeOf(client.post("/hello", { name: "hello" })).toEqualTypeOf<
      Promise<{ name: string }>
    >();
  });
  it("infers return type for post with no body", async () => {
    const client = new RTClient<typeof app>("http://localhost:3000");
    expectTypeOf(client.post("/test")).toEqualTypeOf<Promise<string>>();
  });
});

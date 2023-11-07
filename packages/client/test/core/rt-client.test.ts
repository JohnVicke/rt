import { describe, expect, it } from "bun:test";
import { RT } from "@rt/server";
import { expectTypeOf } from "expect-type";
import { object, string } from "valibot";
import { RTClient } from "../../src";

const app = new RT()
  .get("/", () => "hello world")
  .post("/hello", { body: object({ name: string() }) }, (ctx) => {
    return { name: ctx.body.name };
  })
  .post("/test", (_ctx) => {
    return "no body";
  })
  .listen(8081);

const client = new RTClient<typeof app>("http://localhost:8081");

describe("RTClient", () => {
  it("infers return type for get", async () => {
    const { data } = await client.get("/");
    expectTypeOf(data).toEqualTypeOf<string>();
    expect(data).toEqual("hello world");
  });
  it("infers return type for post", async () => {
    const { data } = await client.post("/hello", { name: "hello" });
    expectTypeOf(data).toEqualTypeOf<{ name: string }>();
    expect(data).toEqual({ name: "hello" });
  });
  it("infers return type for post with no body", async () => {
    const { data } = await client.post("/test");
    expectTypeOf(data).toEqualTypeOf<string>();
    expect(data).toEqual("no body");
  });
});

import { describe, it } from "bun:test";
import { RTClient } from "../../src";
import { RT } from "@rt/server";
import { expectTypeOf } from "expect-type";
import { object, string } from "valibot";

describe("RTClient", () => {
  const app = new RT()
    .get("/", () => "hello world")
    .post("/hello", { body: object({ name: string() }) }, async (ctx) => {
      return { name: ctx.body.name };
    });

  it("infers return type for get", async () => {
    const client = new RTClient<typeof app>("http://localhost:3000");
    expectTypeOf(client.get("/")).toEqualTypeOf<Promise<string>>();
  });
});

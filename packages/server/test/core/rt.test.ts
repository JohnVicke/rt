import { describe, expect, it } from "bun:test";
import { expectTypeOf } from "expect-type";
import { object, string } from "valibot";
import { RT } from "../../src";
import { testRequest } from "../__util";

describe("RT", () => {
  describe("get", () => {
    it("handles root path", async () => {
      const app = new RT().get("/", () => "hello world");
      const res = await app.fetch(testRequest("/"));
      expect(await res.text()).toEqual("hello world");
    });
    it("handles nested path", async () => {
      const app = new RT().get("/hello/world/whats/up", () => "hello world");
      const res = await app.fetch(testRequest("/hello/world/whats/up"));
      expect(await res.text()).toEqual("hello world");
    });
    it("returns JSON response if handler returns object", async () => {
      const app = new RT().get("/hello/world/whats/up", () => ({
        hello: "world",
      }));
      const res = await app.fetch(testRequest("/hello/world/whats/up"));
      expect(await res.json<any>()).toEqual({ hello: "world" });
    });
    it("returns 404 if path is not found", async () => {
      const app = new RT().get("/hello/world/whats/up", () => ({
        hello: "world",
      }));
      const res = await app.fetch(testRequest("/hello/world/whats/up/"));
      expect(res.status).toEqual(404);
    });
  });
  describe("post", () => {
    it("has unknown type if schemas not provided", async () => {
      const app = new RT().post("/hello", async (ctx) => {
        expectTypeOf(ctx.body).toEqualTypeOf<unknown>();
        return { foo: "bar" };
      });

      const res = await app.fetch(
        testRequest("/hello", {
          method: "POST",
        }),
      );
      expect(await res.json<any>()).toEqual({ foo: "bar" });
    });
    it("has correct body if schema provided", async () => {
      const app = new RT().post(
        "/hello",
        { body: object({ name: string() }) },
        (ctx) => {
          expectTypeOf(ctx.body).toEqualTypeOf<{ name: string }>();
          return { name: ctx.body.name };
        },
      );

      const res = await app.fetch(
        testRequest("/hello", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: "viktor" }),
        }),
      );
      expect(await res.json<any>()).toEqual({ name: "viktor" });
    });
  });
});

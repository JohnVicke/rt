import { object, string } from "valibot";
import { RTRoute } from "../../core/route";
import { describe, expect, it } from "bun:test";
import { Equal, Expect } from "../__type-helpers";

const testInputSchema = object({ name: string(), test: string() });

describe("RTRoute", () => {
  describe("procedure flow", () => {
    it("should verify body and return correct response", async () => {
      const route = new RTRoute();
      route.body(testInputSchema).handler(({ body }) => {
        return new Response(JSON.stringify(body));
      });

      const testUrl = new URL("http://localhost:3000/test");
      const testRequest = new Request(testUrl.toString(), {
        body: JSON.stringify({ name: "test", test: "test" }),
      });

      const procedure = route.procedeur();
      const response = await procedure(testUrl, testRequest);
      expect(response.status).toBe(200);
      const json = await response.json();
      expect(json).toEqual({ name: "test", test: "test" });
    });
    it("should throw 400 error if body is incorrect", async () => {
      const route = new RTRoute();
      route.body(testInputSchema).handler(({ body }) => {
        return new Response(JSON.stringify(body));
      });

      const testUrl = new URL("http://localhost:3000/test");
      const testRequest = new Request(testUrl.toString(), {
        body: JSON.stringify({ foo: "test" }),
      });

      const procedure = route.procedeur();
      const response = await procedure(testUrl, testRequest);
      expect(response.status).toBe(400);
    });
    it("should verify params and return correct response", async () => {
      const route = new RTRoute();
      route.params(testInputSchema).handler(({ params }) => {
        return new Response(JSON.stringify(params));
      });

      const testUrl = new URL("http://localhost:3000?name=test&test=test");
      const testRequest = new Request(testUrl.toString());

      const procedure = route.procedeur();
      const response = await procedure(testUrl, testRequest);
      expect(response.status).toBe(200);
    });
    it("should throw 400 error if params are incorrect", async () => {
      const route = new RTRoute();
      route.params(testInputSchema).handler(({ params }) => {
        return new Response(JSON.stringify(params));
      });

      const testUrl = new URL("http://localhost:3000");
      const testRequest = new Request(testUrl.toString());

      const procedure = route.procedeur();
      const response = await procedure(testUrl, testRequest);
      expect(response.status).toBe(400);
    });
  });
  describe("[TYPES]", () => {
    it("should infer body schema in handler if provided", () => {
      new RTRoute().body(testInputSchema).handler(({ body }) => {
        type test = Expect<Equal<typeof body, { name: string; test: string }>>;
        return new Response();
      });
    });
    it("should infer input schema as never in handler if not provided", () => {
      new RTRoute().handler(({ body }) => {
        type test = Expect<Equal<typeof body, never>>;
        return new Response();
      });
    });
  });
});

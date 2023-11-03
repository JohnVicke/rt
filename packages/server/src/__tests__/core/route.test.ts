import { object, string } from "valibot";
import { RTRoute } from "../../core/route";
import { describe, it } from "bun:test";
import { Equal, Expect } from "../__type-helpers";

const testInputSchema = object({ name: string(), test: string() });

describe("RTRoute", () => {
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

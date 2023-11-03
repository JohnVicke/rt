import { RTRouter } from "../../core/router";
import { describe, expect, it } from "bun:test";

describe("RTRouter", () => {
  it("should return registered routes", () => {
    const router = new RTRouter({
      "/test": new RTRouter({}),
    });
    expect(router.routes).toEqual({
      "/test": new RTRouter({}),
    });
  });
});

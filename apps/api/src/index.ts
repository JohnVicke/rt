import { RT } from "@rt/server";

const app = new RT()
  .get("/", () => "Hello World!")
  .get("/hello", () => ({ message: "Hello World!" }))
  .listen(3000, () => {
    console.log("Server is running on port 3000");
  });

export type App = typeof app;

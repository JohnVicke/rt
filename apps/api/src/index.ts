import { RT } from "@rt/server";

new RT()
  .get("/", () => "Hello World!")
  .get("/hello", () => ({ message: "Hello World!" }))
  .listen(3000, () => {
    console.log("Server is running on port 3000");
  });

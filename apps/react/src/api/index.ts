import { type App } from "@rt/api";
import { RTClient } from "@rt/client";

export const client = new RTClient<App>("http://localhost:3000");

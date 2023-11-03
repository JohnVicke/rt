import { type Input, picklist } from "valibot";

export const HttpMethod = picklist(["GET", "POST", "PUT", "DELETE"]);
export type HttpMethod = Input<typeof HttpMethod>;

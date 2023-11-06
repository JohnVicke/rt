import { BaseSchema, Input } from "valibot";

type HandlerInit<TPath> = {
  path: TPath;
  handler: Function;
};

export type HandlerContext<TBody = unknown> = {
  request: Request;
  body: Input<BaseSchema<TBody>>;
};

export class Handler<const TPath extends string> {
  public path: string;
  private handlerFn: Function;

  constructor(options: HandlerInit<TPath>) {
    this.path = options.path;
    this.handlerFn = options.handler;
  }

  async run(context: HandlerContext) {
    const result = await this.handlerFn(context);

    if (typeof result === "object") {
      return new Response(JSON.stringify(result), {
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(result);
  }
}

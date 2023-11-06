import { BaseSchema, Input } from "valibot";

type HandlerInit<THandlerFn, TBodySchema> = {
  handler: THandlerFn;
  bodySchema?: TBodySchema;
};

export type HandlerContext<TBody = unknown> = {
  request: Request;
  body: Input<BaseSchema<TBody>>;
};

export class Handler<
  THandlerFn extends (context: HandlerContext<TBodySchema>) => any,
  TBodySchema = undefined,
> {
  public handlerFn: THandlerFn;
  public bodySchema?: TBodySchema;

  constructor(options: HandlerInit<THandlerFn, TBodySchema>) {
    this.handlerFn = options.handler;
    this.bodySchema = options.bodySchema;
  }

  async run(context: HandlerContext<TBodySchema>) {
    const result = await this.handlerFn(context);

    if (typeof result === "object") {
      return new Response(JSON.stringify(result), {
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(result);
  }
}

import { type Input, type BaseSchema } from "valibot";

type HandlerFnOptions<TBody, TQuery> = {
  body: TBody extends BaseSchema ? Input<TBody> : never;
  params: TQuery extends BaseSchema ? Input<TQuery> : never;
};

export class RTRoute<TBody = unknown, TParams = unknown> {
  private bodySchema?: BaseSchema<TBody>;
  private paramSchema?: BaseSchema<TParams>;
  private handlerFn?: (options: HandlerFnOptions<TBody, TParams>) => Response;

  getHandlerFn() {
    return this.handlerFn;
  }

  body<TSchema>(schema: BaseSchema<TSchema>) {
    this.bodySchema = schema as any;
    return this as unknown as RTRoute<typeof schema, typeof this.paramSchema>;
  }

  params<TSchema>(schema: BaseSchema<TSchema>) {
    this.paramSchema = schema as any;
    return this as unknown as RTRoute<typeof this.bodySchema, typeof schema>;
  }

  handler(handlerFn: (options: HandlerFnOptions<TBody, TParams>) => Response) {
    this.handlerFn = handlerFn;
    return this;
  }
}

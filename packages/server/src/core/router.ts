import { object, string, type ObjectEntries, type ObjectSchema, type Output } from "valibot";

export class RTRouter {
  private routes: Record<string, RTRoute<any>>;

  constructor(routerInit: Record<string, RTRoute<any>>) {
    this.routes = routerInit;
  }
}

export class RTRoute<TSchema extends ObjectEntries> {
  private inputSchema: ObjectSchema<TSchema> | undefined;
  private handlerFn: (options: {
    input: Output<ObjectSchema<TSchema>>;
  }) => Response;

  constructor() {
    this.inputSchema = undefined;
    this.handlerFn = () => new Response();
  }

  getInputSchema() {
    return this.inputSchema;
  }

  getHandlerFn() {
    return this.handlerFn;
  }

  input<TEntries extends ObjectEntries>(schema: ObjectSchema<TEntries>) {
    this.inputSchema = schema as any;
    return this as unknown as RTRoute<TEntries>;
  }

  handler(handlerFn: (options: { input: Output<ObjectSchema<TSchema>> }) => Response) {
    this.handlerFn = handlerFn;
    return this;
  }
}

const inputSchema = object({ name: string(), test: string() });

const schema = new RTRoute().input(inputSchema).handler(({ input }) => {
  console.log(input.name);
  return new Response();
});

const schema2 = new RTRoute().handler(({ input }) => {
  console.log(input.name);
  return new Response();
});

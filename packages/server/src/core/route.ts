import { type Input, type BaseSchema, parseAsync, ValiError } from "valibot";
import { HttpStatusCode } from "../types/http-code";

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

  private async bodyPromise(req: Request) {
    if (!req.body || !this.bodySchema) {
      return Promise.resolve(undefined);
    }

    const json = await req.json();

    return parseAsync(this.bodySchema, json);
  }

  private async paramPromise(url: URL) {
    if (!this.paramSchema) {
      return Promise.resolve(undefined);
    }

    return parseAsync(this.paramSchema, Object.fromEntries(url.searchParams));
  }

  procedeur() {
    return async (url: URL, req: Request) => {
      if (!this.handlerFn) {
        throw new Error("Handler is not defined");
      }

      const bodyPromise = this.bodyPromise(req);
      const paramsPromise = this.paramPromise(url);

      const [body, params] = await Promise.allSettled([
        bodyPromise,
        paramsPromise,
      ]);

      if (body.status === "rejected") {
        return new Response(getErrorMsg(body.reason, "invalid body"), {
          status: HttpStatusCode.BAD_REQUEST,
        });
      }

      if (params.status === "rejected") {
        return new Response(getErrorMsg(params.reason, "invalid body"), {
          status: HttpStatusCode.BAD_REQUEST,
        });
      }

      const options = {
        body: body.value,
        params: params.value,
      } as HandlerFnOptions<TBody, TParams>;

      return this.handlerFn(options);
    };
  }
}

const getErrorMsg = (error: any, fallback: string) => {
  if (error instanceof ValiError) {
    return JSON.stringify(
      error.issues.map((i) => ({
        message: i.message,
        path: i.path?.map((p) => p.key).join("."),
      })),
    );
  }
  return fallback;
};

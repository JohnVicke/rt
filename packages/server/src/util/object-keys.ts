export function objectKeys<TObj extends Record<PropertyKey, any>>(
  obj: TObj,
): Array<keyof TObj> {
  return Object.keys(obj) as Array<keyof TObj>;
}

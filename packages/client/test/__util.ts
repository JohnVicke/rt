export const testRequest = (path: string, options?: RequestInit) =>
  new Request(`http://localhost${path}`, options);

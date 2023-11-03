import { RTRoute } from "./route";

export class RTRouter {
  private registeredRoutes: Record<string, RTRoute>;

  constructor(routerInit: Record<string, RTRoute>) {
    this.registeredRoutes = routerInit;
  }

  get routes() {
    return this.registeredRoutes;
  }
}

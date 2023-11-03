import { RTRoute } from "./route";

export class RTRouter {
  private registeredRoutes: Record<string, RTRoute | RTRouter>;

  constructor(routerInit: Record<string, RTRoute | RTRouter>) {
    this.registeredRoutes = routerInit;
  }

  get routes() {
    return this.registeredRoutes;
  }
}

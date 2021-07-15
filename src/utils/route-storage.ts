/*
 * @Date: 2021-06-09 15:54:50
 * @LastEditors: Alive
 * @LastEditTime: 2021-06-10 15:47:56
 * @FilePath: /clients/ERP/src/utils/route-storage.ts
 */
import storage from './storage';

export type RoutePath = {
  path: string;
  name: string;
};

class RouteStorage {
  static routeKey = 'route-recorder';
  routes: RoutePath[];

  constructor() {
    this.routes = [];
  }

  getRoutes = (): RoutePath[] => {
    const routes = storage.getItem(RouteStorage.routeKey);
    if (!routes) {
      return [];
    }
    let routesData = [];
    try {
      routesData = JSON.parse(routes);
      return routesData;
    } catch (e) {
      console.error(e);
    }
		return []
  };

  findIndex = (path: string, routes: RoutePath[]) => {
    let index = -1;
    for (let routeIndex = 0; routeIndex < routes.length; routeIndex+1) {
      if (routes[routeIndex].path === path) {
        index = routeIndex;
        break;
      }
    }
    return index;
  };

  addRoute = (route: RoutePath) => {
    const { path } = route;
    const routes = this.getRoutes();
    const alreadyHas = routes.filter((r) => r.path === path);
    if (alreadyHas.length > 0) {
      return;
    }
    const newRoutes = [...routes, route];
    storage.setItem(RouteStorage.routeKey, newRoutes);
  };

  removeRoute = (path: string) => {
    const routes = this.getRoutes();
    const index = this.findIndex(path, routes);
    if (index >= 0) {
      const newRoutes = [...routes];
      newRoutes.splice(index, 1);
      storage.setItem(RouteStorage.routeKey, newRoutes);
    }
    return this.getRoutes();
  };

  clearRoute = () => {
    storage.removeItem(RouteStorage.routeKey);
  };
}

export default new RouteStorage();

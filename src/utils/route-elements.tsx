/*
 * @Date: 2021-06-17 08:51:59
 * @LastEditors: Alive
 * @FilePath: /src/utils/route-elements.tsx
 */
import React from 'react';
import ConfigRoutes from '../../config/routes';

class RouteElements {
  data: { [key: string]: React.ReactNode } = {};

  getRouteInBasicLayoutRoutes = (routes: any[], routePath: string): any => {
    let targetRoute = null;
    for (let i = 0; i < routes.length; i+1) {
      const route = routes[i];
      if (route.path === routePath) {
        if (route.redirectTo) {
          targetRoute = this.getRouteInBasicLayoutRoutes(routes, route.redirectTo);
        } else {
          targetRoute = route;
        }
        if (targetRoute) break;
      }
      if (route.routes && route.routes.length > 0) {
        targetRoute = this.getRouteInBasicLayoutRoutes(route.routes, routePath);
        if (targetRoute) break;
      }
    }
    return targetRoute;
  };

  getRouteByRoutePath = (routePath: string): any => {
    const basicLayoutRoute = ConfigRoutes.filter((r) => r.component === '@/layout/BasicLayout')[0];
    if (!basicLayoutRoute) return null;
    const routes = basicLayoutRoute.routes || [];
    if (routes.length === 0) return null;
    const route = this.getRouteInBasicLayoutRoutes(routes, routePath);
    if (!route || !route.component) return null;
    return route;
  };

  getElementsByRoute = async (routePath: string) => {
    const route = this.getRouteByRoutePath(routePath);
    if (!route) return null;
    // FIXME: 动态 import 在编译时报错，rm -rf ./src/.umi 后编译会一直卡在 99%
    /**
     * 错误详情：
       error in ./src/pages/document.ejs
       Module parse failed: Unexpected token (1:0)
       You may need an appropriate loader to handle this file type, currently no loaders are configured to process this file. See https://webpack.js.org/concepts#loaders
     */
    const RouteClass = (await import(`@/pages/${route.component.replace('./', '')}`)).default;
    // console.log(route, RouteClass.default)
    return RouteClass;
  };

  addElements = async (route: string) => {
    const currentElements = this.getElements(route);
    if (!currentElements) {
      const RouteElementDom = await this.getElementsByRoute(route);
      this.data[route] = RouteElements ? <RouteElementDom /> : null;
      // this.data[route] = elements;
    }
    return this.data;
  };

  getElements(route: string) {
    return this.data[route] || null;
  }

  removeElements(route: string) {
    delete this.data[route];
    return this.data;
  }
}

const routeElements = new RouteElements();

export function getRouteElements(route: string) {
  return routeElements.getElements(route);
}
export function addRouteElements(route: string) {
  return routeElements.addElements(route);
}
export function removeRouteElements(route: string) {
  return routeElements.removeElements(route);
}

export default routeElements.data;

/*
 * @Date: 2021-06-16 09:35:45
 * @LastEditors: Alive
 * @FilePath: /clients/ERP/src/layout/BasicLayout.tsx
 */
import React, { Component } from 'react';
import { Tabs } from 'antd';
import { history } from 'umi';
import defaultSettings from '../../config/defaultSettings';
import Footer from '@/components/Footer';
import { getInitialState } from '@/app';
import ProLayout from '@ant-design/pro-layout';
import RightContent from '@/components/RightContent';
import RouteStorage from '@/utils/route-storage';
import { addRouteElements, removeRouteElements } from '@/utils/route-elements';
import TabContentLayout from './TabContentLayout'
import type { RoutePath } from '@/utils/route-storage';

const { TabPane } = Tabs;

type BasicLayoutState = {
  initialState: any;
  activeKey: string;
  routes: RoutePath[];
  pathname: string;
};

type BasicLayoutProps = {
  location: {
    pathname: string;
    [key: string]: any;
  };
  route: any;
};


class BasicLayout extends Component<BasicLayoutProps, BasicLayoutState> {
  state: BasicLayoutState = {
    initialState: {},
    activeKey: '',
    routes: [],
    pathname: '',
  };

  mounted = false;

  constructor(props: BasicLayoutProps) {
    super(props);
    this.setInitialState();
  }

  componentDidMount() {
    const { location } = this.props;
    const { pathname } = location;
    const storeRoutes = RouteStorage.getRoutes();
    const currentIndex = RouteStorage.findIndex(pathname, storeRoutes);
    const currentRoute = storeRoutes[currentIndex] || {};
    const activeKey = currentRoute.path;
    addRouteElements(activeKey);
    this.mounted = true;
    this.setState({
      activeKey: currentRoute.path,
      pathname,
    });
  }

  static getDerivedStateFromProps(props: BasicLayoutProps, state: BasicLayoutState) {
    if (props.location.pathname !== state.pathname) {
      const storeRoutes = RouteStorage.getRoutes();
      const { location } = props;
      const { pathname } = location;
      const currentIndex = RouteStorage.findIndex(pathname, storeRoutes);
      const currentRoute = storeRoutes[currentIndex] || {};
      return { routes: storeRoutes, activeKey: currentRoute.path, pathname };
    }
    return null;
  }

  // shouldComponentUpdate(nextProps: BasicLayoutProps, nextState: BasicLayoutState) {
  //   console.log(nextState, this.state);
  //   console.log(nextProps, this.props);
  //   return nextState.activeKey !== this.state.activeKey || !this.mounted;
  //   // return true
  // }

  setInitialState = async () => {
    const initialState = await getInitialState();
    const storeRoutes = RouteStorage.getRoutes();
    this.setState({ initialState, routes: storeRoutes });
  };

  recordRoute = async ({ path, name }: RoutePath) => {
    RouteStorage.addRoute({ name, path });
    await addRouteElements(path);
    history.replace(path);
  };

  goto = (path: string) => {
    history.replace(path);
  };

  onEdit = (
    targetKey: string | React.MouseEvent<Element, MouseEvent> | React.KeyboardEvent<Element>,
    action: 'add' | 'remove',
  ) => {
    if (action === 'remove' && typeof targetKey === 'string') {
      const newRoutes = RouteStorage.removeRoute(targetKey);
      removeRouteElements(targetKey);
      if (this.state.activeKey === targetKey) {
        this.goto(newRoutes[0].path);
        return;
      }
      this.setState({ routes: newRoutes });
    }
  };

  render() {
    const { initialState, activeKey, routes } = this.state;
    if (!initialState.menuData) return null;
    return (
      <div
        style={{
          height: '100vh',
        }}
      >
        <ProLayout
          layout="side"
          disableContentMargin
          fixedHeader
          rightContentRender={() => <RightContent />}
          waterMarkProps={{
            content: initialState?.currentUser?.name,
            gapX: 50,
            gapY: 50,
          }}
          footerRender={() => <Footer />}
          menuDataRender={(menuData) => initialState?.menuData || menuData}
          menuItemRender={(menuItemProps, defaultDom) => {
            return (
              <div onClick={() => this.recordRoute(menuItemProps as RoutePath)}>{defaultDom}</div>
            );
          }}
          {...this.props}
          {...defaultSettings}
          {...initialState?.settings}
        >
          <Tabs
            hideAdd
            className="route-tabs"
            type={routes.length === 1 ? 'card' : 'editable-card'}
            tabPosition="top"
            size="small"
            activeKey={activeKey}
            onTabClick={async (ak) => {
              await addRouteElements(ak);
              this.goto(ak);
            }}
            onEdit={this.onEdit}
          >
            {routes.map((route) => {
              return (
                <TabPane forceRender tab={route.name} key={route.path} className="route-tab-pan">
                  <TabContentLayout route={route} />
                </TabPane>
              );
            })}
          </Tabs>
        </ProLayout>
      </div>
    );
  }
}

export default BasicLayout;

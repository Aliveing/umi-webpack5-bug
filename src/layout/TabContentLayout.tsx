/*
 * @Date: 2021-07-15 09:25:46
 * @LastEditors: Alive
 * @FilePath: /src/layout/TabContentLayout.tsx
 */
import { Component } from 'react';
import { getRouteElements } from '@/utils/route-elements';

type TabContentLayoutProps = {
  route: any;
};

class TabContentLayout extends Component<TabContentLayoutProps> {
  // shouldComponentUpdate(nextProps: TabContentLayoutProps) {
  //   return nextProps.route.path !== this.props.route.path
  // }

  render() {
    const { route } = this.props;
    return getRouteElements(route.path);
  }
}

export default TabContentLayout
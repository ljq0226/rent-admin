import auth, { AuthParams } from '@/utils/authentication';
import { useEffect, useMemo, useState } from 'react';

export type IRoute = AuthParams & {
  name: string;
  key: string;
  // 当前页是否展示面包屑
  breadcrumb?: boolean;
  children?: IRoute[];
  // 当前路由是否渲染菜单项，为 true 的话不会在菜单中显示，但可通过路由地址访问。
  ignore?: boolean;
};

export const routes: IRoute[] = [
  {
    name: 'menu.dashboard',
    key: 'dashboard',
    children: [
      {
        name: 'menu.dashboard.workplace',
        key: 'dashboard/workplace',
      },
      {
        name: 'menu.dashboard.monitor',
        key: 'dashboard/monitor',
        requiredPermissions: [
          { resource: 'menu.dashboard.monitor', actions: ['write'] },
        ],
      },
    ],
  },
  {
    name: 'menu.listings',
    key: 'listings',
    children: [
      {
        name: 'menu.listings.list',
        key: 'listings/list',
      },
    ],
  },
  {
    name: 'menu.tenant',
    key: 'tenant',
    children: [
      {
        name: 'menu.tenant.list',
        key: 'user2/tenantlist',
      },
    ],
  },
  {
    name: 'menu.order',
    key: 'order',
    children: [
      {
        name: 'menu.order.list',
        key: 'order/list',
      },
      {
        name: 'menu.order.addorder',
        key: 'order/addorder',
      },
    ],
  },
  {
    name: 'menu.contract',
    key: 'contract',
    children: [
      {
        name: 'menu.contract.list',
        key: 'contract/list',
      },
    ],
  },
  {
    name: 'menu.user',
    key: 'user',
    children: [
      {
        name: 'menu.user.info',
        key: 'user/info',
      },
      {
        name: 'menu.user.setting',
        key: 'user/setting',
      },
    ],
  },
];
export const routes_admin: IRoute[] = [
  {
    name: 'menu.dashboard',
    key: 'dashboard',
    children: [
      {
        name: 'menu.dashboard.workplace',
        key: 'dashboard/workplace',
      },
      {
        name: 'menu.dashboard.monitor',
        key: 'dashboard/monitor',
        requiredPermissions: [
          { resource: 'menu.dashboard.monitor', actions: ['write'] },
        ],
      },
    ],
  },
  {
    name: 'menu.listings',
    key: 'listings',
    children: [
      {
        name: 'menu.listings.list',
        key: 'listings/list',
      },
      {
        name: 'menu.listings.check',
        key: 'listings/check',
      },
    ],
  },
  {
    name: 'menu.user2',
    key: 'user2',
    children: [
      {
        name: 'menu.user2.tenantlist',
        key: 'user2/tenantlist',
      },
      {
        name: 'menu.user2.landlordlist',
        key: 'user2/landlordlist',
      },
    ],
  },
  {
    name: 'menu.order',
    key: 'order',
    children: [
      {
        name: 'menu.order.list',
        key: 'order/list',
      },
    ],
  },
  {
    name: 'menu.contract',
    key: 'contract',
    children: [
      {
        name: 'menu.contract.list',
        key: 'contract/list',
      },
    ],
  },
  {
    name: 'menu.review',
    key: 'review',
    children: [
      {
        name: 'menu.review.list',
        key: 'review/list',
      },
    ],
  },
  {
    name: 'menu.visualization',
    key: 'visualization',
    children: [
      {
        name: 'menu.visualization.dataAnalysis',
        key: 'visualization/data-analysis',
        requiredPermissions: [
          { resource: 'menu.visualization.dataAnalysis', actions: ['read'] },
        ],
      },
      {
        name: 'menu.visualization.multiDimensionDataAnalysis',
        key: 'visualization/multi-dimension-data-analysis',
        requiredPermissions: [
          {
            resource: 'menu.visualization.dataAnalysis',
            actions: ['read', 'write'],
          },
          {
            resource: 'menu.visualization.multiDimensionDataAnalysis',
            actions: ['write'],
          },
        ],
        oneOfPerm: true,
      },
    ],
  },
  {
    name: 'menu.user',
    key: 'user',
    children: [
      {
        name: 'menu.user.info',
        key: 'user/info',
      },
      {
        name: 'menu.user.setting',
        key: 'user/setting',
      },
    ],
  },
];
export const getName = (path: string, routes) => {
  return routes.find((item) => {
    const itemPath = `/${item.key}`;
    if (path === itemPath) {
      return item.name;
    } else if (item.children) {
      return getName(path, item.children);
    }
  });
};

export const generatePermission = (role: string) => {
  const actions = role === 'admin' ? ['*'] : ['read'];
  const result = {};
  routes.forEach((item) => {
    if (item.children) {
      item.children.forEach((child) => {
        result[child.name] = actions;
      });
    }
  });
  return result;
};

const useRoute = (userPermission, isAdmin = false): [IRoute[], string] => {
  const _routes = isAdmin ? routes_admin : routes;
  const filterRoute = (_routes: IRoute[], arr = []): IRoute[] => {
    if (!_routes.length) {
      return [];
    }
    for (const route of _routes) {
      const { requiredPermissions, oneOfPerm } = route;
      let visible = true;
      if (requiredPermissions) {
        visible = auth({ requiredPermissions, oneOfPerm }, userPermission);
      }

      if (!visible) {
        continue;
      }
      if (route.children && route.children.length) {
        const newRoute = { ...route, children: [] };
        filterRoute(route.children, newRoute.children);
        if (newRoute.children.length) {
          arr.push(newRoute);
        }
      } else {
        arr.push({ ...route });
      }
    }
    return arr;
  };

  const [permissionRoute, setPermissionRoute] = useState(_routes);

  useEffect(() => {
    const newRoutes = filterRoute(_routes);
    setPermissionRoute(newRoutes);
  }, [JSON.stringify(userPermission)]);

  const defaultRoute = useMemo(() => {
    const first = permissionRoute[0];
    if (first) {
      const firstRoute = first?.children?.[0]?.key || first.key;
      return firstRoute;
    }
    return '';
  }, [permissionRoute]);

  return [permissionRoute, defaultRoute];
};

export default useRoute;

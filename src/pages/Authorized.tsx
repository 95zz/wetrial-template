import React, { useEffect } from 'react';
import { IMenuDataItem } from '@wetrial/types';
import pathToRegexp from 'path-to-regexp';
import { Redirect, router } from 'umi';
import { connect } from 'dva';
import { getToken } from '@/utils/store';
import Authorized from '@/utils/Authorized';
import { getPermissions } from '@/utils/authority';
import PageLoading from '@/components/PageLoading';

/**
 * 层级路由对象
 */
interface IRouteLevelDto {
  pathname: string;
  parentPathName: string;
}

// 将menu转换成 列表
const getAuthorizedSimpleMenus = (
  menus: IMenuDataItem[],
  parentPathName: string,
): IRouteLevelDto[] => {
  let authorizedMenus: IRouteLevelDto[] = new Array<IRouteLevelDto>();
  const currentPermissions = getPermissions();

  menus
    .filter(item => item && item.name && !item.hideInMenu)
    .forEach(item => {
      if (item.routes && Array.isArray(item.routes) && !item.hideChildrenInMenu) {
        if (item.routes.some(route => route && !!route.name)) {
          const childRoutes = getAuthorizedSimpleMenus(item.routes, item.path);
          if (childRoutes.length > 0) {
            if (Authorized.hasPermissions(item.authority, currentPermissions)) {
              const routeLevelDto: IRouteLevelDto = {
                pathname: item.path,
                parentPathName,
              };
              authorizedMenus.push(routeLevelDto);
            }
            authorizedMenus = authorizedMenus.concat(childRoutes);
          }
        }
      } else if (Authorized.hasPermissions(item.authority, currentPermissions)) {
        const routeLevelDto: IRouteLevelDto = {
          pathname: item.path,
          parentPathName,
        };
        authorizedMenus.push(routeLevelDto);
      }
    });
  return authorizedMenus;
};

interface DefaultRedirectProps {
  pathname: string;
  routes: IMenuDataItem[];
}

const DefaultRedirect: React.FC<DefaultRedirectProps> = props => {
  useEffect(() => {
    const menus = getAuthorizedSimpleMenus(props.routes, '');
    // 如果没有任何菜单权限 则跳到403页面
    if (menus.length === 0) {
      router.push({
        pathname: '/403',
        query: {
          redirect: props.pathname,
        },
      });
    } else {
      router.push({
        pathname: menus[0].pathname,
        query: {
          redirect: props.pathname,
        },
      });
    }
  }, []);
  return <PageLoading />;
};

const getRouteAuthority = (path: string, routeData: IMenuDataItem[]) => {
  let authorities: string[] | string | undefined;
  routeData.forEach(route => {
    // match prefix
    if (pathToRegexp(`${route.path}(.*)`).test(path)) {
      // exact match
      if (route.path === path) {
        authorities = route.authority || authorities;
      }
      // get children authority recursively
      if (route.routes) {
        authorities = getRouteAuthority(path, route.routes) || authorities;
      }
    }
  });
  return authorities;
};

function AuthComponent({ children, location = { pathname: '' }, route = { routes: [] } }) {
  const { routes = [] } = route;
  const isLogin = !!getToken();
  return (
    <Authorized
      authority={getRouteAuthority(location.pathname, routes)}
      noMatch={
        isLogin ? (
          <DefaultRedirect routes={routes} pathname={location.pathname} />
        ) : (
          <Redirect to={`/user/login?redirect=${window.location.href}`} />
        )
      }
    >
      {children}
    </Authorized>
  );
}
export default connect(({ user }) => ({
  user,
}))(AuthComponent);

// import router from "umi/router";
import { routerRedux } from 'dva/router';
import extendModel from '@/wetrial/model';
import { clearToken, setToken } from '@/wetrial/store';
import { getCurrent, loginout, login } from '@/services/user';
import { reloadAuthorized } from '@/utils/Authorized';
import { setPermissions,clearPermissions } from "@/utils/authority";
import { getRedirect} from '@/utils';

export default extendModel({
  namespace: 'user',
  state: {
    currentUser: {
      permissions:null
    },
  },
  effects: {
    *getCurrent(_, { call, put }) {
      const currentUser = yield call(getCurrent);
      yield setPermissions(currentUser.permissions);
      // yield reloadAuthorized();
      yield put({
        type:'reloadAuthorizedAndMenu',
      })

      yield put({
        type: 'update',
        payload: {
          currentUser
        },
      });
    },
    *login({ payload }, { call, put }) {
      const result = yield call(login, payload);
      // login success
      if (result && result.token) {
        setToken(result.token);
        const redirect = getRedirect();
        yield put(routerRedux.replace(redirect));
      }
    },
    *loginOut(_, { call, put }) {
      yield call(loginout);
      yield clearToken();
      yield clearPermissions();
      yield reloadAuthorized();
      yield put(
        routerRedux.replace({
          pathname: '/user/login',
        })
      )
    },
    *reloadAuthorizedAndMenu(_,{put,select}){
      yield reloadAuthorized();
      const routes=yield select(state => state.menu.routerData)||[]
      yield put({
        type:'menu/getMenuData',
        payload:{
          routes
        }
      })
    }
    // // 当request获取api后端数据 算作未登录时，触发此effects
    // *unAuthorizedRedirect(_,{put}){
    //   notification.error({
    //     message:'提示',
    //     description: '登录已过期，请重新登录',
    //   });
      
    //   yield put(
    //     routerRedux.push({
    //       pathname: '/user/login',
    //       search: stringify({
    //         redirect: window.location.href,
    //       }),
    //     })
    //   )
    // }
  }
});

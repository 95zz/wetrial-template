import extendModel from '@/wetrial/model';
import { getAll, getNotifys, getMessages, getTodos, setAllToRead } from '@/services/message';

// 计算总数
const calcTotal = (state) => {
  let count = 0;
  const { todos, messages, notifys } = state;
  if (todos && todos.count) {
    count += todos.count;
  }
  if (messages && messages.count) {
    count += messages.count;
  }
  if (notifys && notifys.count) {
    count += notifys.count;
  }
  return count;
}

export default extendModel({
  namespace: 'global',
  state: {
    collapsed: false, // 左侧菜单面板是否折叠
    tipsFetched:false,
    tips:{
      count: 0, // 总数量
      // 待办列表
      todos: {
        list: [],
        count: 0
      },
      // 消息列表
      messages: {
        list: [],
        count: 0
      },
      // 通知列表
      notifys: {
        list: [],
        count: 0
      }
    }    
  },
  effects: {
    *getAll({payload={force:false}}, { call, put,select }) {
      if(!payload.force){
        const isFetched = yield select(state => state.global.tipsFetched);
        if(isFetched){
          return;
        }
      }
      else{
        const all = yield call(getAll);
        yield put({
          type: 'updateWithSum',
          payload: {
            ...all,
            tipsFetched:true
          }
        });
      }
    },
    *getNotifys(_, { call, put }) {
      const notifys = yield call(getNotifys);
      yield put({
        type: 'updateWithSum',
        payload: {
          notifys
        }
      });
    },
    *getTodos(_, { call, put }) {
      const todos = yield call(getTodos);
      yield put({
        type: 'updateWithSum',
        payload: {
          todos
        }
      });
    },
    *getMessages(_, { call, put }) {
      const messages = yield call(getMessages);
      yield put({
        type: 'updateWithSum',
        payload: {
          messages
        }
      });
    },
    *setAllToRead({ payload }, { call, put }) {
      yield call(setAllToRead, payload);
      yield put({
        type: 'updateWithSum',
        payload: {

        }
      })
    }
  },
  reducers: {
    changeCollapsed(state, { payload }) {
      return {
        ...state,
        collapsed: payload
      }
    },
    updateWithSum(state, { payload }) {
      const tips = {
        ...state.tips,
        ...payload
      }
      const count = calcTotal(tips);
      return {
        ...state,
        tips:{
          ...tips,
          count
        }
      }
    }
  },
  // subscriptions: {
  // setup({ history }) {
  //   // Subscribe history(url) change, trigger `load` action if pathname is `/`
  //   return history.listen(({ pathname, search }) => {
  //     if (typeof window.ga !== 'undefined') {
  //       window.ga('send', 'pageview', pathname + search);
  //     }
  //   });
  // },
  // }
});

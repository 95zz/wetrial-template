import { get, post } from '@/utils/request';
import { API_PREFIX } from '@/constants';

/**
 * 获取个人的待办、消息、通知列表
 */
export async function getAll() {
  return get(`${API_PREFIX}message/getAll`);
}

/**
 * 获取个人的待办列表
 */
export async function getTodos() {
  return get(`${API_PREFIX}message/getTodos`);
}

/**
 * 获取个人的消息列表
 */
export async function getMessages() {
  return get(`${API_PREFIX}message/getMessages`);
}

/**
 * 获取个人的通知列表
 */
export async function getNotifys() {
  return get(`${API_PREFIX}message/getNotifys`);
}

/**
 * 将指定类型的消息设置为已读
 * @param type 指定的类型
 */
export async function setAllToRead(type) {
  return post({
    url: `${API_PREFIX}message/setAllToRead`,
    data: {
      type,
    },
  });
}

export async function triggerException() {
  return get({
    url: `${API_PREFIX}message/triggerException`,
  });
}

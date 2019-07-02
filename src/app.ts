import { UnAuthorizedException } from 'wetrial/exception';
import { notification } from 'antd';

export const dva = {
  config: {
    onError(err) {
      if (err instanceof UnAuthorizedException) {
        const unAuthorizedErr = err as UnAuthorizedException;
        notification.info({
          message: unAuthorizedErr.message,
        });

        // eslint-disable-next-line no-console
        console.log(unAuthorizedErr.message);
      }
      err.preventDefault();
    },
  },
};

export function render(oldRender) {
  oldRender();
}

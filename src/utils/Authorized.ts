import {Authorized as RenderAuthorized} from '@/wetrial';
import { getPermissions } from './authority';

let Authorized = RenderAuthorized(getPermissions()); // eslint-disable-line

// Reload the rights component
const reloadAuthorized = () => {
  Authorized = RenderAuthorized(getPermissions());
};

export { reloadAuthorized };
export default Authorized;

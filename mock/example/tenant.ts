import responseWrapper,{errorWrapper,authorizeIntercept} from '../base';
import Mock from 'mockjs';
import { delay } from 'roadhog-api-doc';

function getTenants({response}){
  const tenants = Mock.mock({
    totalCount: 10,
    "items|10": [
      {
        "id": '@guid',
        "tenancyName": '@csentence(5,30)',
        "name": '@csentence(5,30)',
        "editionDisplayName": 'Standand',
        "isActive":true,
        "creationTime": '@datetime("yyyy-MM-dd")'
      }
    ]
  });
  return response.json(responseWrapper(tenants));
}

function getTenant({response}){
  const tenant = Mock.mock({
    "id": "@guid",
    "tenancyName": "@csentence(5,8)",
    "name": "@csentence(2,4)",
    "isActive:1-2": "安徽省",
    "creationTime":'@datetime("yyyy-MM-dd")'
  });
  return response.json(responseWrapper(tenant));
}

// 调用 delay 函数，统一处理
export default delay({
  'GET /api/tenant/getTenants':(req,res)=>authorizeIntercept({request:req,response:res},getTenants),
  'GET /api/tenant/getTenant':(req,res)=>authorizeIntercept({request:req,response:res},getTenant)
}, 1000);

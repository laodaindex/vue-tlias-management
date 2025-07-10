import axios from 'axios'
//创建axios实例
import router from '../router'

import { ElMessage } from 'element-plus'

const request = axios.create({
    baseURL: 'api',
    timeout: 500
})
//请求request拦截器
request.interceptors.request.use(
    (config) => {
        //成功回调
        const loginUser = JSON.parse(localStorage.getItem('loginUser'));
        if(loginUser&&loginUser.token){
        config.headers.token = loginUser.token
        }
        return config

    },
    (error) => {
        return Promise.reject(error)
    }
)

//响应response拦截器
// 响应response拦截器
request.interceptors.response.use(
    (response) => {
      console.log('响应成功:', response);
      return response.data;
    },
    (error) => {
      console.log('响应错误:', error);
      if (error.response && error.response.status === 401) {
        localStorage.removeItem('loginUser');
        ElMessage.error('登录过期，请重新登录');
        router.push('/login');
      }
      return Promise.reject(error);
    }
  );

//导出request
export default request;
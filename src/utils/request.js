import axios from 'axios'
//创建axios实例
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
request.interceptors.response.use(
    (response) => {//处理响应数据
        return response.data
    },
    (error) => {//处理响应错误
        return Promise.reject(error)
    }
)

//导出request
export default request;

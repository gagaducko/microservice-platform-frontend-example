import axios from 'axios';

// 网关的端口作为统一入口
const instance = axios.create({
    baseURL: 'http://127.0.0.1:31001',
    timeout: 1000000
});

// 请求拦截器
instance.interceptors.request.use(config => {
    return config;
}, err => {
    return Promise.reject(err);
})

// 响应拦截器
instance.interceptors.response.use(res => {
    return res.data;
}, err => {
    return Promise.reject(err);
})


// 动态设置 baseURL 的函数
export const setBaseURL = (url) => {
    instance.defaults.baseURL = url;
    console.log("instance is:", instance)
};

export default instance;
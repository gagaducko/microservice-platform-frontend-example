import axios from 'axios';

// 网关的端口作为统一入口
const instance = axios.create({
    baseURL: 'http://127.0.0.1:38880',
    timeout: 1000000
});

// 请求拦截器
instance.interceptors.request.use(config => {
    // 将 JWT token，添加到请求的 headers 中
    let token = localStorage.getItem('access_token');
    config.headers['Authorization'] = "GaGaDuck: " + token;
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

export default instance;
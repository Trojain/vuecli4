import Vue from 'vue'
import axios from 'axios'; // 引入axios
import QS from 'qs'; // 引入qs模块，用来序列化post类型的数据
import router from '../router'
import { getStore, removeStore } from 'js/store'
import { showLoading, hideLoading } from '../assets/js/loading';

// 环境的切换(暂时改用本地代理跨域,以下代码暂时不启用)
axios.defaults.baseURL = process.env.VUE_APP_API;

// if (process.env.NODE_ENV === 'development') {
//     // axios.defaults.baseURL可以设置axios的默认请求地址
//     axios.defaults.baseURL = 'http://192.168.212.11:8080/';
// } else if (process.env.NODE_ENV === 'debug') {
//     axios.defaults.baseURL = '';
// } else if (process.env.NODE_ENV === 'production') {
//     axios.defaults.baseURL = 'http://www.xxx.com';
// }

// 请求超时时间
axios.defaults.timeout = 10000;

// post请求头
// axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';


// 请求拦截器
axios.interceptors.request.use(config => {
    console.log('请求拦截器');

    // 显示loading
    showLoading();

    // 每次发送请求之前判断是否存在token，如果存在，则统一在http请求的header都加上token，不用每次请求都手动添加了
    const token = getStore({ name: 'access_token', type: "string" });
    console.log(token);
    if (token) {
        config.headers.Authorization = 'Bearer ' + token;
    }
    return config;
}, error => {
    // 隐藏loading
    hideLoading();
    return Promise.error(error);
})

// 响应拦截器
axios.interceptors.response.use(response => {
    console.log('响应拦截器');

    // 隐藏loading
    hideLoading();

    if (response.status === 200) {
        return Promise.resolve(response);
    } else {
        return Promise.reject(response);
    }

}, (error) => {
    // 隐藏loading
    hideLoading();

    // 服务器状态码不是200的情况
    if (error.response.status) {
        switch (error.response.status) {

            // 401: 未登录
        case 401:
            alert('未登录');
            // 清除token
            removeStore({ name: 'access_token' });
            // 跳转登录页面，并将要浏览的页面fullPath传过去，登录成功后跳转需要访问的页面
            router.replace({
                path: '/login',
                query: {
                    redirect: router.currentRoute.fullPath
                }
            });
            break;

            // 403 token过期
        case 403:
            alert('登录过期，请重新登录');
            // 清除token
            removeStore({ name: 'access_token' });
            // 跳转登录页面，并将要浏览的页面fullPath传过去，登录成功后跳转需要访问的页面
            setTimeout(() => {
                router.replace({
                    path: '/login',
                    query: {
                        redirect: router.currentRoute.fullPath
                    }
                });
            }, 1000);
            break;

            // 其他错误，直接抛出错误提示    
        default:
            alert(error.response.data.message);
            break;
        }
    }

    // 抛出错误提示
    Vue.prototype.$message.error(error.response.data.message);
    return Promise.reject(error);
})


/**
 * get方法，对应get请求
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 */
function get(url, params) {
    return new Promise((resolve, reject) => {
        axios.get(url, {
                params: params
            })
            .then(res => {
                resolve(res.data);
            })
            .catch(err => {
                reject(err.data)
            })
    });
}

/**
 * post方法，对应post请求
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 */
function post(url, params) {
    return new Promise((resolve, reject) => {
        axios.post(url, QS.stringify(params))
            .then(res => {
                resolve(res.data);
            })
            .catch(err => {
                reject(err.data)
            })
    });
}

/**
 * put方法， 对应put请求
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 */
function put(url, params) {
    return new Promise((resolve, reject) => {
        axios.put(url, QS.stringify(params))
            .then(res => {
                resolve(res.data);
            })
            .catch(err => {
                reject(err.data)
            })
    });
}

/**
 * del方法， 对应delete请求
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 */
function del(url, params) {
    return new Promise((resolve, reject) => {
        axios.delete(url, QS.stringify({ data: params }))
            .then(res => {
                resolve(res.data);
            })
            .catch(err => {
                reject(err.data)
            })
    });
}

export default {
    get,
    post,
    put,
    del
}
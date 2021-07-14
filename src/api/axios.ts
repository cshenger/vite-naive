import axios from "axios";
import router from "@/router";
import store from "@/store";
import qs from "qs";
import {
  useMessage
} from 'naive-ui';

let pending :any[] = []; //声明一个数组用于存储每个ajax请求的取消函数和ajax标识
// let cancelToken = axios.CancelToken;
let removePending = (config :any) => {
  for (let p in pending) {
    if (pending[p].u === config.url + "&" + config.method) {
      //当当前请求在数组中存在时执行函数体
      pending[p].f(config.url + "取消"); //执行取消操作
      pending.splice(p, 1); //把这条记录从数组中移除
    }
  }
};

// 上传函数 及方法 感谢操老板，不然我自己得写死o(╥﹏╥)o
function isNumber(val:any) {
  var regPos = /^\d+(\.\d+)?$/; //非负浮点数
  var regNeg = /^(-(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*)))$/; //负浮点数
  if (regPos.test(val) || regNeg.test(val)) {
    return true;
  } else {
    return false;
  }
}

function renderFormData(formData:any, params:any, preference:any) {
  if (preference == undefined) preference = "";
  Object.keys(params).map((key) => {
    if (Object.prototype.toString.call(params[key]) === "[object Object]") {
      if (isNumber(key)) {
        renderFormData(formData, params[key], preference + "[" + key + "]");
      } else {
        let preference_key = "";
        if (preference == "") {
          preference_key = preference + key;
        } else {
          preference_key = preference + "." + key;
        }
        renderFormData(formData, params[key], preference_key);
      }
    } else if (Array.isArray(params[key])) {
      let preference_key = "";
      if (preference == "") {
        preference_key = preference + key;
      } else {
        preference_key = preference + "." + key;
      }
      if (isNumber(key)) {
        renderFormData(formData, params[key], preference + "[" + key + "]");
      } else {
        renderFormData(formData, params[key], preference_key);
      }
    } else {
      if (isNumber(key)) {
        formData.append(preference + "[" + key + "]", params[key]);
        // console.log(
        //   preference + "[" + key + "]",
        //   formData.getAll(preference + "[" + key + "]")
        // );
      } else {
        let preference_key = "";
        if (preference == "") {
          preference_key = preference + key;
        } else {
          preference_key = preference + "." + key;
        }
        formData.append(preference_key, params[key]);
        // console.log(preference + key, formData.getAll(preference + key));
      }
    }
  });
}

const config = {
  method: "get",
  // 基础url前缀
  baseUrl: "/api",
  // baseUrl: "",
  // 请求头信息
  headers: {
    "Content-Type": "application/json;charset=UTF-8"
  },
  // 参数
  data: {},
  // 设置超时时间
  timeout: 60000,
  // 携带凭证
  withCredentials: false,
  // 返回数据类型
  responseType: "json"
};

function gotoLogin() {
  store.commit("del_token");
  if (window.location.hash.indexOf('#/login') !== -1) {
    router.replace({
      path: "/login"
    });
  } else {
    router.replace({
      path: "/login",
      query: {
        redirect: window.location.hash
      }
    });
  }
}

function $axios(options:any) {
  return new Promise((resolve, reject) => {
    const instance = axios.create({
      baseURL: config.baseUrl,
      headers: config.headers,
      timeout: config.timeout,
      withCredentials: config.withCredentials
    });

    // request 拦截器
    instance.interceptors.request.use(
      config => {
        // console.log(config)
        // let token = store.state.token;
        if (!options.ignoreReq) {
          removePending(config); //在一个ajax发送前执行一下取消操作
        }
        // 1. 带上token
        // if (token) {
        //   config.headers.Authorization = "bearer " + token
        // } else {
        //   // 重定向到登录页面
        //   if (!store.state.refresh_token) {
        //     router.push('/login')
        //   }
        // }
        // 2. 根据请求方法，序列化传来的参数，根据后端需求是否序列化
        if (config.method === "post") {
          // if (config.data.__proto__ === FormData.prototype ||
          //   config.url.endsWith('path') ||
          //   config.url.endsWith('mark') ||
          //   config.url.endsWith('patchs')
          // ) {
          // } else {
          //   config.data = qs.stringify(config.data)
          // }
        }

        // 全局拦截添加token
        if (store.state.token != "") {
          // config.headers.common['Authorization'] = 'Bearer ' + store.state.token
          config.headers.common["Authorization"] = store.state.token;
        }

        // 全局拦截请求在路由配置里触发取消上一页面的请求
        if (!options.ignoreReq) {
          config.cancelToken = new axios.CancelToken(cancel => {
            window.__asxiosPromiseArr.push({
              cancel
            });
            // 这里的ajax标识我是用请求地址&请求方式拼接的字符串，当然你可以选择其他的一些方式
            pending.push({
              u: config.url + "&" + config.method,
              f: cancel
            });
          });
        }

        return config;
      },

      error => {
        // 请求错误时
        console.log("request:", error);
        // 1. 判断请求超时
        if (
          error.code === "ECONNABORTED" &&
          error.message.indexOf("timeout") !== -1
        ) {
          console.log("timeout请求超时");
          // return service.request(originalRequest);// 再重复请求一次
        }
        // 2. 需要重定向到错误页面
        const errorInfo = error.response;
        console.log(errorInfo);
        if (errorInfo) {
          error = errorInfo.data; // 页面那边catch的时候就能拿到详细的错误信息,看最下边的Promise.reject
          const errorStatus = errorInfo.status; // 404 403 500 ...
          router.push({
            path: `/error/${errorStatus}`
          });
        }
        return Promise.reject(error); // 在调用的那边可以拿到(catch)你想返回的错误信息
      }
    );

    // response 拦截器
    instance.interceptors.response.use(
      response => {
        if (!options.ignoreReq) {
          removePending(response.config); //在一个ajax响应后再执行一下取消操作，把已经完成的请求从pending中移除
        }
        let data;
        // IE9时response.data是undefined，因此需要使用response.request.responseText(Stringify后的字符串)
        if (response.data == undefined) {
          data = JSON.parse(response.request.responseText);
        } else {
          data = response.data;
        }

        // 根据返回的code值来做不同的处理
        // switch (data.rc) {
        //   case 1:
        //     console.log(data.desc)
        //     break;
        //   case 0:
        //     store.commit('changeState')
        //     // console.log('登录成功')
        //   default:
        // }
        // 若不是正确的返回code，且已经登录，就抛出错误
        // const err = new Error(data.desc)
        // err.data = data
        // err.response = response
        // throw err

        return data;
      },
      err => {
        if (err && err.response) {
          switch (err.response.status) {
            case 400:
              err.message = "请求错误";
              break;
            case 401:
              err.message = err.response.data.message || "未授权，请登录";
              gotoLogin();
              break;
            case 403:
              err.message = "拒绝访问";
              break;
            case 404:
              err.message = `请求地址出错: ${err.response.config.url}`;
              break;
            case 408:
              err.message = "请求超时";
              break;
            case 500:
              err.message =
                err.response.data.message ||
                err.response.data.msg ||
                "服务器内部错误";
              break;
            case 501:
              err.message = "服务未实现";
              break;
            case 502:
              err.message = "网关错误";
              break;
            case 503:
              err.message = "服务不可用";
              break;
            case 504:
              err.message = "网关超时";
              break;
            case 505:
              err.message = "HTTP版本不受支持";
              break;
            default:
          }
        }
        console.error(err);
        return Promise.reject(err); // 返回接口返回的错误信息
      }
    );

    // 请求处理
    instance(options)
      .then(res => {
        resolve(res);
        return false;
      })
      .catch(error => {
        reject(error);
      });
  });
}

/*
$http({
	method: 'GET',
	url: url,
	params: params
}, r => {}, err => {})
*/

function $http(options:any, success:any, failure:any) {
  // 创造message方法的实例
  const message = useMessage();

  if (!!options.loading && options.loading) {
    store.commit("changeSpinning", true);
  }

  let headers = options.headers ? options.headers : config.headers;
  if (!options.params) {
    options.params = {};
  }
  options.params.fuckie = new Date().getTime();

  return $axios({
      method: options.method ? options.method : "GET",
      url: options.url,
      headers: headers,
      params: options.method ?
        options.method === "GET" ||
        options.method === "get" ||
        options.method === "DELETE" ||
        options.method === "delete" ?
        options.params :
        null : options.params,
      data: (function () {
        if (
          options.method === "POST" ||
          options.method === "post" ||
          options.method === "PUT" ||
          options.method === "put"
        ) {
          if (
            options.headers &&
            options.headers["Content-Type"] == "multipart/form-data"
          ) {
            let formData = new FormData();
            renderFormData(formData, options.data);
            return formData;
          } else if (
            options.headers &&
            options.headers["Content-Type"] == "text/plain"
          ) {
            return qs.stringify(options.data);
          } else {
            return options.data;
          }
        } else {
          return options.data;
        }
      })(),
      baseURL: options.baseURL ? options.baseURL : config.baseURL,
      withCredentials: options.withCredentials ?
        options.withCredentials : config.withCredentials,
      timeout: options.timeout ? options.timeout : config.timeout,
      ignoreReq: options.ignoreReq ? options.ignoreReq : null
    })
    .then(res => {
      if (!!options.loading && options.loading) store.commit("changeSpinning", false);
      if (res.code == 200 && res.success) {
        if (!!options.showSucMes && options.showSucMes) {
          message.success(res.message, {
            duration: 5000
          });
        }
        success && success(res);
        return new Promise((resolve) => {
          resolve(res);
        });
      } else {
        if (
          !!res.status &&
          (res.status == "0001" || res.status == "0002" || res.status == "0003")
        ) {
          console.error(res);
          gotoLogin();
        }
        if (!res.success) {
          if (!options.hideError) {
            let messageFn = () => {
              message.error(res.message, {
                duration: 5000
              });
            };

            if (res.code == 401 || res.code == 408 || res.code == 409) {
              if (document.getElementsByClassName("el-message").length === 0) {
                messageFn();
              }
              gotoLogin();
            } else {
              messageFn();
            }
          }

          failure && failure(res);
          return new Promise((resolve) => {
            resolve(res);
          });
        } else {
          failure && failure(res);
          return new Promise((resolve) => {
            resolve(res);
          });
        }
      }
    })
    .catch(err => {
      if (axios.isCancel(err)) {
        console.log("Rquest canceled: " + err.message);
        if (!!options.loading && options.loading) store.commit("changeSpinning", false);
      } else {
        console.log("****************");
        console.error(err);
        console.log("****************");
        if (!options.hideError) {
          message.error(err.message, {
            duration: 5000
          });
        }
        if (!!options.loading && options.loading) store.commit("changeSpinning", false);
        failure && failure(err);
      }
      return new Promise((resolve, reject) => {
        reject(err);
      });
    });
}

export default $http;
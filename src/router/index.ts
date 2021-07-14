import {
  createRouter,
  createWebHashHistory
} from 'vue-router'
import routes from "./routes"
import store from "@/store";
// import { useMessage } from 'naive-ui';

//页面刷新时，重新赋值token
if (sessionStorage.getItem("token")) {
  store.commit("set_token", {
    token: sessionStorage.getItem("token"),
    userId: sessionStorage.getItem("userId"),
    // userRole: (sessionStorage.getItem("userRole")).split(","),
    loginName: sessionStorage.getItem("loginName"),
    userName: sessionStorage.getItem("userName"),
  });
}

const router = createRouter({
  history: createWebHashHistory(),
  routes
});

window.__asxiosPromiseArr = [];

router.beforeEach((to, from, next) => {
  let token = store.state.token;

  // if (token) {
  //   let userRole = store.state.userRole;
  //   if (to.meta && to.meta.roles) {
  //     if (hasRoles(userRole, to.meta.roles)) {
  //       next();
  //     } else {
  //       message.error('该用户无此权限');
  //       next('/login');
  //     }
  //   } else {
  //     next();
  //   }
  // } else {
  //   if (to.path === '/login') { //这就是跳出循环的关键
  //     next()
  //   } else {
  //     next('/login')
  //   }
  // }
  next();

  // 取消上一个路由的请求
  function cancelToken() {
    if (window.__asxiosPromiseArr) {
      window.__asxiosPromiseArr.forEach((ele, index) => {
        ele.cancel("cancel");
        delete window.__asxiosPromiseArr[index];
      });
    }
  }

  cancelToken();
});

export default router
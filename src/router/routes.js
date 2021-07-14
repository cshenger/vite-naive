import {
  h,
} from "vue";
import Home from '@/components/Home.vue'
import {
  NIcon
} from "naive-ui";
import {
  BookOutline as BookIcon,
  PersonOutline as PersonIcon,
  WineOutline as WineIcon,
} from "vicons/ionicons-v5";

function renderIcon(icon) {
  return () => h(NIcon, null, {
    default: () => h(icon)
  });
}

const routes = [{
    path: '/',
    name: 'Index',
    key: 'Index',
    redirect: '/dashboard/index',
    hidden: true,
    label: "首页",
    icon: renderIcon(BookIcon),
  },

  // 首页
  {
    path: '/dashboard',
    name: 'Dashboard',
    key: 'Dashboard',
    redirect: '/dashboard/index',
    component: Home,
    label: "首页",
    icon: renderIcon(BookIcon),
    meta: {
      label: "首页",
    },
    children: [{
      path: "/dashboard/index",
      name: 'DashboardIndex',
      key: 'DashboardIndex',
      component: () => import('../views/HelloWorld.vue'),
      label: "Hello",
      icon: renderIcon(BookIcon),
      meta: {
        label: "Hello",
      }
    }, {
      path: "/dashboard/page1",
      name: 'DashboardPage1',
      key: 'DashboardPage1',
      component: () => import('../views/Page1.vue'),
      label: "第一页",
      icon: renderIcon(PersonIcon),
      meta: {
        label: "第一页",
      }
    }]
  },

  // 第二页
  {
    path: "/users",
    name: 'Users',
    key: 'Users',
    redirect: '/users/index',
    component: Home,
    label: "账户",
    icon: renderIcon(WineIcon),
    meta: {
      label: "账户",
    },
    children: [{
      path: '/users/index',
      name: 'UsersIndex',
      key: 'UsersIndex',
      component: () => import('../views/Page2.vue'),
      label: "第二页",
      icon: renderIcon(WineIcon),
      meta: {
        label: "第二页",
      },
    }],
  },
]

export default routes;
import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'

// --- استيراد التخطيطات الرئيسية (Layouts) ---
import AppLayout from '@/components/layout/AppLayout.vue'
import AuthLayout from '@/components/layout/AuthLayout.vue'

// --- استيراد الصفحات الأساسية ---
import LoginView from '@/views/LoginView.vue'
import DashboardView from '@/views/dashboard/DashboardView.vue'

// --- استيراد صفحات النظام الأساسي (إدارة النظام) ---
const UsersList = () => import('@/views/users/UsersList.vue')
const RolesList = () => import('@/views/roles/RolesList.vue')
const BackupsList = () => import('@/views/settings/BackupsList.vue')

// --- استيراد صفحات نظام المطعم والكاشير ---
const PublicMenuView = () => import('@/views/menu/PublicMenuView.vue')
// const WaiterMenuView = () => import('@/views/waiter/WaiterMenuView.vue')
// const CartView = () => import('@/views/waiter/CartView.vue')
// const RemoteOrdersView = () => import('@/views/orders/RemoteOrdersView.vue')

// شاشة توليد الباركود
const MenuQRCodeView = () => import('@/views/settings/MenuQRCodeView.vue')

const routes = [
  // --- المسارات العامة ---
  {
    path: '/',
    component: AuthLayout,
    children: [
      { path: 'login', name: 'Login', component: LoginView },
      { path: '', redirect: '/login' },
    ],
  },

  // مسار منيو الزبائن (Barcode Menu)
  {
    path: '/menu',
    name: 'PublicMenu',
    component: PublicMenuView,
    meta: { requiresAuth: false },
  },

  // --- المسارات المحمية ---
  {
    path: '/app',
    component: AppLayout,
    meta: { requiresAuth: true },
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: DashboardView,
        meta: { permission: 'dashboard.view' },
      },

      // --- مسارات إدارة النظام ---
      {
        path: 'users',
        name: 'UsersList',
        component: UsersList,
        meta: { permission: 'user.view' },
      },
      {
        path: 'roles',
        name: 'RolesList',
        component: RolesList,
        meta: { permission: 'role.view' },
      },
      {
        path: 'settings/backups',
        name: 'BackupsList',
        component: BackupsList,
        meta: { permission: 'backup.view' },
      },

      // // --- مسارات نظام المطعم ---
      // {
      //   path: 'waiter-menu',
      //   name: 'WaiterMenu',
      //   component: WaiterMenuView,
      //   meta: { permission: 'categories.view' },
      // },
      // {
      //   path: 'cart',
      //   name: 'CartView',
      //   component: CartView,
      //   meta: { permission: 'categories.view' },
      // },
      // {
      //   path: 'remote-orders',
      //   name: 'RemoteOrdersList',
      //   component: RemoteOrdersView,
      //   meta: { permission: 'remote_orders.view' },
      // },

      // مسار شاشة توليد الباركود
      {
        path: 'menu-qrcode',
        name: 'MenuQRCodeView',
        component: MenuQRCodeView,
        meta: { permission: 'categories.view' },
      },

      { path: '', redirect: '/app/dashboard' },
    ],
  },

  { path: '/:pathMatch(.*)*', redirect: '/' },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  const { isAuthenticated, can } = authStore

  if (to.meta.requiresAuth) {
    if (!isAuthenticated) {
      authStore.returnUrl = to.fullPath
      next({ name: 'Login' })
    } else {
      const requiredPermission = to.meta.permission
      if (requiredPermission && !can(requiredPermission)) {
        console.warn(
          `Access denied: route "${String(to.name)}" requires permission "${requiredPermission}"`,
        )
        next({ name: 'Dashboard' })
      } else {
        next()
      }
    }
  } else {
    next()
  }
})

export default router

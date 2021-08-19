import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

import App from '../App'

const router = new VueRouter({
  mode: 'history',
  hash: false,
  base: "./",
  routes: [
    { path: "/", component: App },
    { path: "/:stop_id", component: App },
    { path: "/:stop_id/rota/:trip_id", component: App },
    { path: "/qrcode", component: App }
  ],
});

const originalPush = router.push
router.push = function push(location, onResolve, onReject) {
  if (onResolve || onReject) {
    return originalPush.call(this, location, onResolve, onReject)
  }

  return originalPush.call(this, location).catch((err) => {
    if (VueRouter.isNavigationFailure(err)) {
      return err
    }

    return Promise.reject(err)
  })
}

export default router

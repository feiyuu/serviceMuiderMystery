module.exports = app => {
    const { router, controller } = app;
    var adminauth = app.middleware.adminauth(); //中间件，路由守卫
    router.get(
        "/common/getPicAuth",
        controller.common.getPicAuth
      );
}
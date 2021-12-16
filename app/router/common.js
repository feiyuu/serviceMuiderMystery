module.exports = (app) => {
  const { router, controller, middleware } = app;
  router.get(
    "/common/getPicAuth",
    middleware.jwt("admin"),
    controller.common.getPicAuth
  );
};

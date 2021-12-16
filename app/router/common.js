module.exports = app => {
    const { router, controller } = app;
    router.get(
        "/common/getPicAuth",
        controller.common.getPicAuth
      );
}
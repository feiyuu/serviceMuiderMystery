module.exports = app => {
    const { router, controller } = app;
    var adminauth = app.middleware.adminauth(); //中间件，路由守卫
    router.get('/default/index', controller.default.home.index)
    router.get('/default/getArticleList', controller.default.home.getArticleList)
    router.get('/default/getArticleById/:id', controller.default.home.getArticleById)
    router.get('/default/getTypeInfo', controller.default.home.getTypeInfo)
    router.get('/default/getListById/:id', controller.default.home.getListById)
    router.get('/default/getPublisherById/:id', controller.default.home.getPublisherById)
    router.post(
        "/default/updateViewCount",
        adminauth,
        controller.default.home.updateViewCount
      );
}
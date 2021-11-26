module.exports = app => {
    const { router, controller } = app;
    var adminauth = app.middleware.adminauth(); //中间件，路由守卫
    router.get('/storeMsMini/index', controller.storeMsMini.user.index)
    router.get('/storeMsMini/checkUserLogin', controller.storeMsMini.user.checkUserLogin)
    router.get('/storeMsMini/checkControllerUserLogin', controller.storeMsMini.user.checkControllerUserLogin)
    router.post('/storeMsMini/registerUser', controller.storeMsMini.user.registerUser)
    router.get('/storeMsMini/getUser', controller.storeMsMini.user.getUser)
    router.get('/storeMsMini/getMineData', controller.storeMsMini.user.getMineData)
    router.get('/storeMsMini/getFilterDramaList', controller.storeMsMini.drama.getFilterDramaList)
}
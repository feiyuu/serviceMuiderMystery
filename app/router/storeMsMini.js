module.exports = app => {
    const { router, controller } = app;
    var adminauth = app.middleware.adminauth(); //中间件，路由守卫
    router.get('/storeMsMini/index', controller.storeMsMini.user.index)
    router.get('/storeMsMini/checkUserLogin', controller.storeMsMini.user.checkUserLogin)
    router.get('/storeMsMini/checkControllerUserLogin', controller.storeMsMini.user.checkControllerUserLogin)
    router.post('/storeMsMini/registerUser', controller.storeMsMini.user.registerUser)
    router.get('/storeMsMini/getUser', controller.storeMsMini.user.getUser)
    router.get('/storeMsMini/getMineData', controller.storeMsMini.user.getMineData)
    router.get('/storeMsMini/getBalanceUser', controller.storeMsMini.user.getBalanceUser)
    router.post('/storeMsMini/payCharge', controller.storeMsMini.user.payCharge)
    router.post('/storeMsMini/reCharge', controller.storeMsMini.user.reCharge)
    router.get('/storeMsMini/getMyPurchaseRecordList', controller.storeMsMini.user.getMyPurchaseRecordList)
    router.get('/storeMsMini/getFilterDramaList', controller.storeMsMini.drama.getFilterDramaList)
    router.get('/storeMsMini/getDramaDetail', controller.storeMsMini.drama.getDramaDetail)
    router.get('/storeMsMini/getHomeDramas', controller.storeMsMini.drama.getHomeDramas)
    router.post('/storeMsMini/collectDrama', controller.storeMsMini.drama.collectDrama)
    router.post('/storeMsMini/unCollectDrama', controller.storeMsMini.drama.unCollectDrama)
    router.get('/storeMsMini/getMyCollectDramaList', controller.storeMsMini.drama.getMyCollectDramaList)
    router.get('/storeMsMini/getTeamList', controller.storeMsMini.team.getTeamList)
    router.get('/storeMsMini/getMyTeamList', controller.storeMsMini.team.getMyTeamList)
    router.get('/storeMsMini/getTeamDetail', controller.storeMsMini.team.getTeamDetail)
    router.post('/storeMsMini/joinTeam', controller.storeMsMini.team.joinTeam)
    router.get('/storeMsMini/getRooms', controller.storeMsMini.store.getRooms)
    router.get('/storeMsMini/getDms', controller.storeMsMini.store.getDms)

   
}
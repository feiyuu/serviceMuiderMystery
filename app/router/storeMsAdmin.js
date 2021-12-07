module.exports = (app) => {
  const { router, controller } = app;
  var adminauth = app.middleware.adminauth(); //中间件，路由守卫

  router.get("/storeMsAdmin/index", controller.storeMsAdmin.user.index);
  router.post(
    "/storeMsAdmin/checkControllerUserLogin",
    controller.storeMsAdmin.user.checkControllerUserLogin
  );
  router.get("/storeMsAdmin/getDMUsers", controller.storeMsAdmin.user.getDMUsers);
  router.get("/storeMsAdmin/getUser", controller.storeMsAdmin.user.getUser);
  router.post("/storeMsAdmin/updateUser", controller.storeMsAdmin.user.updateUser);
  router.post("/storeMsAdmin/inertUser", controller.storeMsAdmin.user.inertUser);
  router.get("/storeMsAdmin/autoId", controller.storeMsAdmin.user.autoId);

  router.get(
    "/storeMsAdmin/getFilterDramaList",
    controller.storeMsAdmin.drama.getFilterDramaList
  );
  router.get(
    "/storeMsAdmin/getDramaDetail",
    controller.storeMsAdmin.drama.getDramaDetail
  );
  router.post(
    "/storeMsAdmin/updateDrama",
    controller.storeMsAdmin.drama.updateDrama
  );


  router.get(
    "/storeMsAdmin/getTeamList",
    controller.storeMsAdmin.team.getTeamList
  );
  router.get(
    "/storeMsAdmin/getMyTeamList",
    controller.storeMsAdmin.team.getMyTeamList
  );
  router.get(
    "/storeMsAdmin/getTeamDetail",
    controller.storeMsAdmin.team.getTeamDetail
  );
  router.post("/storeMsAdmin/joinTeam", controller.storeMsAdmin.team.joinTeam);
  router.get("/storeMsAdmin/getRooms", controller.storeMsAdmin.store.getRooms);
  router.get("/storeMsAdmin/getDms", controller.storeMsAdmin.store.getDms);
  router.get("/storeMsAdmin/getGoods", controller.storeMsAdmin.store.getGoods);
  router.post(
    "/storeMsAdmin/placeOrder",
    controller.storeMsAdmin.store.placeOrder
  );
  router.get(
    "/storeMsAdmin/getMyOrderList",
    controller.storeMsAdmin.store.getMyOrderList
  );
  router.get(
    "/storeMsAdmin/getOrderDetail",
    controller.storeMsAdmin.store.getOrderDetail
  );
  router.post(
    "/storeMsAdmin/updaTeOrder",
    controller.storeMsAdmin.store.updaTeOrder
  );
};

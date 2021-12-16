const whiteListMini = [
  "checkUserLogin",
  "getRooms",
  "getDms",
  "getHomeDramas",
  "getGoods",
  "checkControllerUserLogin",
]; //白名单（一般登录注册这两个接口不需要校验token）此处也可配置在全局
const whiteListAdmin = ["checkControllerUserLogin"]; //白名单（一般登录注册这两个接口不需要校验token）此处也可配置在全局

module.exports = (options) => {
  console.log("options============" + options);
  var whiteList = [];
  if (options == "mini") {
    whiteList = whiteListMini;
  } else {
    whiteList = whiteListAdmin;
  }
  return async function (ctx, next) {
    if (!whiteList.some((item) => ctx.request.url.indexOf(item) != -1)) {
      //判断接口路径是否在白名单
      let token = ctx.request.header.authorization; //拿到token
      console.log("token============" + token);
      if (token && token != "null") {
        console.log("if (token) {============" + token);
        //如果token存在
        let decoded = ctx.app.jwt.verify(
          token,
          options == "mini"
            ? ctx.app.config.jwt.secretMini
            : ctx.app.config.jwt.secretAdmin
        ); //解密token
        console.log("decoded============" + JSON.stringify(decoded));
        if (decoded && decoded.message) {
          ctx.body = {
            code: 101,
            msg: decoded.message,
          };
        } else {
          ctx.openid = decoded.openid; //把接口带来的用户名存在ctx上，方便后续做判断。
          await next();
        }
      } else {
        ctx.body = {
          code: 101,
          msg: "没有token",
        };
      }
    } else {
      await next();
    }
  };
};

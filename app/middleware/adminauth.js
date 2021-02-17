module.exports = (options) => {
  return async function adminauth(ctx, next) {
    console.log('守卫');
    console.log(ctx.session);
    console.log(ctx.session.openId);
    if (ctx.session) {
      await next();
    } else {
      ctx.body = { data: "没有登录" };
    }
  };
};

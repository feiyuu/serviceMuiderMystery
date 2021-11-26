"use strict";

const Controller = require("egg").Controller;

class MainController extends Controller {
  async index() {
    this.ctx.body = "hahahahaha mian";
  }
  async checkControllerUserLogin() {
    let userName = this.ctx.request.body.userName;
    let password = this.ctx.request.body.password;
    const sql =
      " SELECT userName FROM users WHERE loginName = '" +
      userName +
      "' AND loginPsw = '" +
      password +
      "'";

    const res = await this.app.mysql.query(sql);
    if (res.length > 0) {
      //登录成功,进行session缓存
      let openId = new Date().getTime();
      this.ctx.session.openId = { openId: openId };
      this.ctx.body = { data: "登录成功", openId: openId };
    } else {
      this.ctx.body = { data: "登录失败" };
    }
  }
  async checkUserLogin() {
    const queryObj = this.ctx.query;
    console.log("checkLogin" + new Date().toDateString);
    var data = await this.ctx.curl(
      "https://api.weixin.qq.com/sns/jscode2session?appid=wx998d4224c089a57d&secret=21e87ded5a27ac74150ae048b63aa54b&js_code=" +
        queryObj.wxCode +
        "&grant_type=authorization_code",
      { method: "GET", dataType: "json" }
    );
    if (data.data && data.data.openid) {
      var ID = data.data.openid;
      const sql =
        " SELECT avatarUrl,gender,nickName FROM users WHERE users.openid = '" +
        ID +
        "'";

      const res = await this.app.mysql.query(sql);

      if (res.length > 0) {
        //登录成功,进行session缓存
        this.ctx.session.openId = { openId: ID };
        this.ctx.body = { data: res, code: 1, openid: ID };
      } else {
        this.ctx.body = { data: "去注册", code: 2, openid: ID };
      }
    } else {
      this.ctx.body = { data: "登录失败", code: 0 };
    }
  }

  async registerUser() {
    let user = this.ctx.request.body;
    console.log("user=====" + JSON.stringify(user));

    if (user.openid == "undefined") {
      this.ctx.body = {
        data: "openid不存在",
        code: 0,
      };
      return;
    }
    const result = await this.app.mysql.insert("users", user);
    const insertSuccess = result.affectedRows === 1;
    const insertId = result.insertId;
    if (insertSuccess) {
      this.ctx.body = {
        isSuccess: insertSuccess,
        code: 1,
      };
    } else {
      this.ctx.body = {
        isSuccess: insertSuccess,
        code: 0,
      };
    }
  }

  async getUser() {
    const queryObj = this.ctx.query;
    const sql =
      " SELECT avatarUrl,gender,nickName FROM users WHERE users.wxCode = '" +
      queryObj.wxCode +
      "'";
    const res = await this.app.mysql.query(sql);
    if (res.length > 0) {
      this.ctx.body = { data: res, code: 1 };
    } else {
      this.ctx.body = { data: "登录失败", code: 0 };
    }
  }

  async getMineData() {
    const queryObj = this.ctx.query;
    const sql =
      " SELECT avatarUrl,gender,nickName,integral,balance FROM users WHERE users.openid = '" +
      queryObj.openid +"'";
    const res = await this.app.mysql.query(sql);
    if (res.length > 0) {
      this.ctx.body = { data: res, code: 1 };
    } else {
      this.ctx.body = { data: "", code: 2 };
    }
  }
}
module.exports = MainController;

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
        this.ctx.body = { data: res[0], code: 1, openid: ID };
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
      queryObj.openid +
      "'";
    const res = await this.app.mysql.query(sql);
    if (res.length > 0) {
      this.ctx.body = { data: res, code: 1 };
    } else {
      this.ctx.body = { data: "", code: 2 };
    }
  }
  async getBalanceUser() {
    const queryObj = this.ctx.query;
    const user = await this.app.mysql.get("users", { openid: queryObj.openid });
    if (user) {
      this.ctx.body = { data: user.balance, code: 1 };
    } else {
      this.ctx.body = { data: "", code: 2 };
    }
  }
  async payCharge() {
    let data = this.ctx.request.body;
    console.log("datapay=====" + JSON.stringify(data));

    if (
      data.recordUserId == "undefined" ||
      data.recordUserId == "" ||
      data.recordUserId == null
    ) {
      this.ctx.body = {
        data: "请登录后再试",
        code: 0,
      };
      return;
    }
    console.log("data.isBlance" + data.isBlance);
    let success = false;

    if (data.isBlance == "true") {
      const conn = await this.app.mysql.beginTransaction();
      try {
        //扣除余额
        let sqlUpdata =
          "UPDATE users SET balance = balance - " +
          data.charge +
          " WHERE openid = '" +
          data.recordUserId +
          "'";
        await conn.query(sqlUpdata);
        //插入资金明细记录
        await conn.insert("purchase_record", {
          ...data,
          recordTime: new Date(+new Date() + 8 * 3600 * 1000)
            .toJSON()
            .substr(0, 19)
            .replace("T", " "),
        });
        await conn.commit(); //提交事务
        success = true;
      } catch (err) {
        success = false;
        await conn.rollback(); //回滚事务
        throw err;
      }
    } else {
      //微信支付加积分
      let sqlUpdata =
        "UPDATE users SET integral = integral + " +
        data.charge +
        " WHERE openid = '" +
        data.recordUserId +
        "'";
      await this.app.mysql.query(sqlUpdata);
      //插入资金明细记录
      const result = await this.app.mysql.insert("purchase_record", {
        ...data,
        recordTime: new Date(+new Date() + 8 * 3600 * 1000)
          .toJSON()
          .substr(0, 19)
          .replace("T", " "),
      });
      success = result.affectedRows === 1;
    }

    if (success) {
      this.ctx.body = {
        data: "支付成功",
        code: 1,
      };
    } else {
      this.ctx.body = {
        data: "支付失败",
        code: 0,
      };
    }
  }
  async reCharge() {
    let data = this.ctx.request.body;
    console.log("reCharge=====" + JSON.stringify(data));

    if (
      data.recordUserId == "undefined" ||
      data.recordUserId == "" ||
      data.recordUserId == null
    ) {
      this.ctx.body = {
        data: "请登录后再试",
        code: 0,
      };
      return;
    }
    let success = false;
    const conn = await this.app.mysql.beginTransaction();
    try {
      //充值
      let sqlUpdata =
        "UPDATE users SET balance = balance + " +
        data.charge +
        ",integral = integral + " +
        data.charge +
        " WHERE openid = '" +
        data.recordUserId +
        "'";
      await conn.query(sqlUpdata);
      //插入充值资金明细记录
      await conn.insert("purchase_record", {
        ...data,
        recordTime: new Date(+new Date() + 8 * 3600 * 1000)
          .toJSON()
          .substr(0, 19)
          .replace("T", " "),
      });
      await conn.commit(); //提交事务
      success = true;
    } catch (err) {
      success = false;
      await conn.rollback(); //回滚事务
      throw err;
    }

    if (success) {
      this.ctx.body = {
        data: "支付成功",
        code: 1,
      };
    } else {
      this.ctx.body = {
        data: "支付失败",
        code: 0,
      };
    }
  }
  async getMyPurchaseRecordList() {
    const queryObj = this.ctx.query;
    const result = await this.app.mysql.select("purchase_record", {
      where: { recordUserId: queryObj.openid },
      orders: [["id", "desc"]],
    });
    if (result) {
      this.ctx.body = { data: result, code: 1 };
    } else {
      this.ctx.body = { data: "", code: 2 };
    }
  }
}
module.exports = MainController;

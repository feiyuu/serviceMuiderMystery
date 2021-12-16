"use strict";

const Controller = require("egg").Controller;

class MainController extends Controller {
  async index() {
    this.ctx.body = "hahahahaha mian";
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

      //wx登录成功,处理token
      const token = this.app.jwt.sign(
        { openid: ID },
        this.app.config.jwt.secretMini,
        { expiresIn: "1h" }
      );
    
      if (res.length > 0) {
        res[0].token = token;
        this.ctx.body = { data: res[0], code: 1 };
      } else {
        this.ctx.body = { data: { token: token }, code: 2 };
      }
    } else {
      this.ctx.body = { data: "登录失败", code: 0 };
    }
  }

  async registerUser() {
    let user = this.ctx.request.body;
    console.log("user=====" + JSON.stringify(user));

    user.openid = this.ctx.openid;
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
      this.ctx.openid +
      "'";
    const res = await this.app.mysql.query(sql);
    if (res.length > 0) {
      this.ctx.body = { data: res, code: 1 };
    } else {
      this.ctx.body = { data: "", code: 2 };
    }
  }
  async getBalanceUser() {
    const user = await this.app.mysql.get("users", { openid: this.ctx.openid });
    if (user) {
      this.ctx.body = { data: user.balance, code: 1 };
    } else {
      this.ctx.body = { data: "", code: 2 };
    }
  }
  async payCharge() {
    let data = this.ctx.request.body;
    console.log("datapay=====" + JSON.stringify(data));

    console.log("data.isBlance" + data.isBlance);
    let success = false;
    data.recordUserId = this.ctx.openid;
    if (data.isBlance == "true") {
      const conn = await this.app.mysql.beginTransaction();
      try {
        //扣除余额
        let sqlUpdata =
          "UPDATE users SET balance = balance - " +
          data.charge +
          " WHERE openid = '" +
          this.ctx.openid +
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
        this.ctx.openid +
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
    data.recordUserId = this.ctx.openid;
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
        this.ctx.openid +
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
    const result = await this.app.mysql.select("purchase_record", {
      where: { recordUserId: this.ctx.openid },
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

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
      " SELECT grade,dmAvatarUrl,dmNickName,Id FROM controller_users WHERE loginName = '" +
      userName +
      "' AND loginPsw = '" +
      password +
      "'";

    const res = await this.app.mysql.query(sql);
    if (res.length > 0) {
      //登录成功,进行session缓存
      let openId = new Date().getTime();
      this.ctx.session.openId = { openId: openId };
      this.ctx.body = { data: res[0], openId: openId, code: 1 };
    } else {
      this.ctx.body = { data: "登录失败", code: 2 };
    }
  }
  async checkUserPsw() {
    let Id = this.ctx.request.body.Id;
    let password = this.ctx.request.body.password;
    const sql =
      " SELECT * FROM controller_users WHERE Id = '" +
      Id +
      "' AND loginPsw = '" +
      password +
      "'";

    const res = await this.app.mysql.query(sql);
    if (res.length > 0) {
      this.ctx.body = { data: "校验通过", code: 1 };
    } else {
      this.ctx.body = { data: "登录失败", code: 2 };
    }
  }
  async getDMUsers() {
    const sql =
      " SELECT * FROM controller_users WHERE grade = 11 ORDER BY Id ASC";
    const res = await this.app.mysql.query(sql);
    if (res.length > 0) {
      this.ctx.body = { data: res, code: 1 };
    } else {
      this.ctx.body = { data: "登录失败", code: 0 };
    }
  }
  async getUser() {
    const queryObj = this.ctx.query;
    console.log("getUser===" + JSON.stringify(queryObj));
    const sql =
      " SELECT * FROM controller_users WHERE controller_users.Id = '" +
      queryObj.Id +
      "'";
    const res = await this.app.mysql.query(sql);
    if (res.length > 0) {
      this.ctx.body = { data: res[0], code: 1 };
    } else {
      this.ctx.body = { data: "登录失败", code: 0 };
    }
  }

  async updateUser() {
    const user = this.ctx.request.body;
    console.log("updateUser===" + JSON.stringify(user));
    const result = await this.app.mysql.update(
      "controller_users",
      {
        ...user,
      },
      {
        where: {
          loginName: user.loginName,
        },
      }
    );

    if (result.affectedRows === 1) {
      this.ctx.body = { data: "修改成功", code: 1 };
    } else {
      this.ctx.body = { data: "修改失败", code: 0 };
    }
  }
  async inertUser() {
    const user = this.ctx.request.body;
    console.log("updateUser===" + JSON.stringify(user));
    const result = await this.app.mysql.insert("controller_users", {
      ...user,
    });

    if (result.affectedRows === 1) {
      this.ctx.body = { data: "创建成功", code: 1 };
    } else {
      this.ctx.body = { data: "创建失败", code: 0 };
    }
  }

  async autoId() {
    const sql = " SELECT COUNT(Id)count FROM controller_users";
    const res = await this.app.mysql.query(sql);
    console.log("res=== " + JSON.stringify(res));
    if (res.length > 0) {
      this.ctx.body = { data: "dm00" + res[0].count, code: 1 };
    } else {
      this.ctx.body = { data: "登录失败", code: 0 };
    }
  }
}
module.exports = MainController;

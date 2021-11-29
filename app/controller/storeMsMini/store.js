"use strict";

const Controller = require("egg").Controller;

class MainController extends Controller {
  async index() {
    this.ctx.body = "hahahahaha mian";
  }
  async getGoods() {
    const result = await this.app.mysql.select("goods", {
      orders: [["id", "ASC"]],
    });
    if (result.length>0) {
      this.ctx.body = { data: result, code: 1 };
    } else {
      this.ctx.body = { data: "", code: 2 };
    }
  }
  async getRooms() {
    const result = await this.app.mysql.select("rooms", {
      orders: [["id", "desc"]],
    });
    if (result) {
      this.ctx.body = { data: result, code: 1 };
    } else {
      this.ctx.body = { data: "", code: 2 };
    }
  }
  async getDms() {
    const result = await this.app.mysql.select("controller_users", {
      where: { grade: 11 },
      orders: [["id", "asc"]],
    });
    if (result) {
      this.ctx.body = { data: result, code: 1 };
    } else {
      this.ctx.body = { data: "", code: 2 };
    }
  }
}
module.exports = MainController;

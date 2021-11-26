"use strict";

const Controller = require("egg").Controller;

class MainController extends Controller {
  async index() {
    this.ctx.body = "hahahahaha mian";
  }
  async getFilterDramaList() {
    const data = this.ctx.query;
    console.log("data=====" + data);
    console.log("filters=====" + data.filters);

    const results = await this.app.mysql.select("dramas", {
      where: {},
      orders: [
        ["id", "desc"], //降序desc，升序asc
      ],
      limit: data.pageSize, //查询条数
      offset: Number(data.page) * Number(data.pageSize) - Number(data.pageSize), //数据偏移量（分页查询使用）
    });

    console.log(results);
    this.ctx.body = {
      code: 1,
      data: results,
    };
  }
}
module.exports = MainController;

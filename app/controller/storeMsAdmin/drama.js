"use strict";

const Controller = require("egg").Controller;

class MainController extends Controller {
  async index() {
    this.ctx.body = "hahahahaha mian";
  }
  async getFilterDramaList() {
    const data = this.ctx.query;
    console.log("data=====" + JSON.stringify(data));
    console.log("filters=====" + data.filters);
    console.log("offset111=====" + Number(data.page) * Number(data.pageSize));
    console.log(
      "offset=====" +
        (Number(data.page) * Number(data.pageSize) - Number(data.pageSize))
    );

    const results = await this.app.mysql.select("dramas", {
      where: JSON.parse(data.filters),
      orders: [
        ["id", "asc"], //降序desc，升序asc
      ],
      limit: Number(data.pageSize), //查询条数
      offset: Number(data.page) * Number(data.pageSize) - Number(data.pageSize), //数据偏移量（分页查询使用）
    });

    // console.log(results);
    if (results.length > 0) {
      this.ctx.body = { code: 1, data: results };
    } else {
      this.ctx.body = { code: 1, data: [] };
    }
  }
  async getDramaDetail() {
    const data = this.ctx.query;
    let drama = await this.app.mysql.get("dramas", { Id: data.Id });
    drama.roles = JSON.parse(drama.roles) || [];
    // let roles = await this.app.mysql.select("roles", {
    //   where: { dramaId: data.Id },
    // });
    // console.log("roles=====" + JSON.stringify(roles));
    // drama.roles = roles;
    if (drama) {
      this.ctx.body = { code: 1, data: drama };
    } else {
      this.ctx.body = { code: 2, data: "查询失败" };
    }
  }

  async getLikeDramaDetail() {
    const data = this.ctx.query;

    let sql = "SELECT * FROM dramas WHERE dramaName LIKE '%" + data.likeDramaName+"%' LIMIT 1";

    let result = await this.app.mysql.query(sql);

    if (result.length>0) {
      this.ctx.body = { code: 1, data: result[0] };
    } else {
      this.ctx.body = { code: 2, data: "查询失败" };
    }
  }
  async updateDrama() {
    let data = this.ctx.request.body;
    data.roles = JSON.stringify(data.roles);
    console.log("updateDrama=====" + JSON.stringify(data));

    let options = {
      where: {
        Id: data.Id,
      },
    };
    const result = await this.app.mysql.update("dramas", data, options);
    const updateSuccess = result.affectedRows === 1;
    if (updateSuccess) {
      this.ctx.body = {
        code: 1,
        data: "修改成功",
      };
    } else {
      this.ctx.body = {
        code: 0,
        data: "修改失败",
      };
    }
  }
}
module.exports = MainController;

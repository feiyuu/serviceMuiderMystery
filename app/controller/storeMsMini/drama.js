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
    let roles = await this.app.mysql.select("roles", {
      where: { dramaId: data.Id },
    });
    console.log("roles=====" + JSON.stringify(roles));
    drama.roles = roles;

    let collectSql =
      "SELECT collectDramas FROM users WHERE openid = '" + data.openid + "'";
    let collectDramas = await this.app.mysql.query(collectSql);
    collectDramas = collectDramas[0].collectDramas;
    console.log("collectDramas=============" + collectDramas);
    let collectArray = collectDramas.split(":");
    collectArray = collectArray.filter(function (s) {
      return s && s.trim();
    });
    console.log("collectArray=============" + collectArray);
    const index = collectArray.indexOf(data.Id);
    console.log("index=============" + index);
    console.log("collectDramas=============" + collectDramas);
    drama.isCollect = index != -1;

    if (drama) {
      this.ctx.body = { code: 1, data: drama };
    } else {
      this.ctx.body = { code: 2, data: "查询失败" };
    }
  }
  async getHomeDramas() {
    const result = await this.app.mysql.select("dramas", {
      limit: 6,
      orders: [["id", "desc"]],
    });
    if (result) {
      this.ctx.body = { data: result, code: 1 };
    } else {
      this.ctx.body = { data: "", code: 2 };
    }
  }
  async collectDrama() {
    let data = this.ctx.request.body;
    console.log("datacollectDrama=====" + JSON.stringify(data));
    if (
      data.openid == "undefined" ||
      data.openid == "" ||
      data.openid == null
    ) {
      this.ctx.body = {
        data: "请登录后再试",
        code: 0,
      };
      return;
    }

    let collectSql =
      "SELECT collectDramas FROM users WHERE openid = '" + data.openid + "'";
    let collectDramas = await this.app.mysql.query(collectSql);
    collectDramas = collectDramas[0].collectDramas;
    console.log("collectDramas=============" + collectDramas);
    let collectArray = collectDramas.split(":");
    collectArray = collectArray.filter(function (s) {
      return s && s.trim();
    });
    console.log("collectArray=============" + collectArray);
    const index = collectArray.indexOf(data.dramaId);
    console.log("index=============" + index);
    console.log("collectDramas=============" + collectDramas);

    if (index == -1) {
      collectDramas = collectDramas + ":" + data.dramaId;
      console.log("indexcollectDramas=============" + collectDramas);
      const result = await this.app.mysql.update(
        "users",
        {
          collectDramas: collectDramas,
        },
        {
          where: {
            openid: data.openid,
          },
        }
      );
      if (result.affectedRows === 1) {
        this.ctx.body = {
          data: "收藏成功",
          code: 1,
        };
      } else {
        this.ctx.body = {
          data: "异常",
          code: 0,
        };
      }
    } else {
      this.ctx.body = {
        data: "已收藏",
        code: 0,
      };
    }
  }
  async getHomeDramas() {
    const result = await this.app.mysql.select("dramas", {
      limit: 6,
      orders: [["id", "desc"]],
    });
    if (result) {
      this.ctx.body = { data: result, code: 1 };
    } else {
      this.ctx.body = { data: "", code: 2 };
    }
  }
  async collectDrama() {
    let data = this.ctx.request.body;
    console.log("datacollectDrama=====" + JSON.stringify(data));
    if (
      data.openid == "undefined" ||
      data.openid == "" ||
      data.openid == null
    ) {
      this.ctx.body = {
        data: "请登录后再试",
        code: 0,
      };
      return;
    }

    let collectSql =
      "SELECT collectDramas FROM users WHERE openid = '" + data.openid + "'";
    let collectDramas = await this.app.mysql.query(collectSql);
    collectDramas = collectDramas[0].collectDramas;
    console.log("collectDramas=============" + collectDramas);
    let collectArray = collectDramas.split(":");
    collectArray = collectArray.filter(function (s) {
      return s && s.trim();
    });
    console.log("collectArray=============" + collectArray);
    const index = collectArray.indexOf(data.dramaId);
    console.log("index=============" + index);
    console.log("collectDramas=============" + collectDramas);

    if (index == -1) {
      collectDramas = collectDramas + ":" + data.dramaId;
      console.log("indexcollectDramas=============" + collectDramas);
      const result = await this.app.mysql.update(
        "users",
        {
          collectDramas: collectDramas,
        },
        {
          where: {
            openid: data.openid,
          },
        }
      );
      if (result.affectedRows === 1) {
        this.ctx.body = {
          data: "收藏成功",
          code: 1,
        };
      } else {
        this.ctx.body = {
          data: "异常",
          code: 0,
        };
      }
    } else {
      this.ctx.body = {
        data: "已收藏",
        code: 0,
      };
    }
  }
  async unCollectDrama() {
    let data = this.ctx.request.body;
    console.log("dataunCollectDrama====" + JSON.stringify(data));
    if (
      data.openid == "undefined" ||
      data.openid == "" ||
      data.openid == null
    ) {
      this.ctx.body = {
        data: "请登录后再试",
        code: 0,
      };
      return;
    }

    let collectSql =
      "SELECT collectDramas FROM users WHERE openid = '" + data.openid + "'";
    let collectDramas = await this.app.mysql.query(collectSql);
    collectDramas = collectDramas[0].collectDramas;
    console.log("collectDramas=============" + collectDramas);
    let collectArray = collectDramas.split(":");
    collectArray = collectArray.filter(function (s) {
      return s && s.trim();
    });
    console.log("collectArray=============" + collectArray);
    const index = collectArray.indexOf(data.dramaId);
    console.log("index=============" + index);
    console.log("collectDramas=============" + collectDramas);

    if (index != -1) {
      delete collectArray[index];
      collectArray = collectArray.filter(function (s) {
        return s && s.trim();
      });
      console.log("indexcollectDramas=============" + collectArray);
      collectDramas = collectArray.join(":");
      const result = await this.app.mysql.update(
        "users",
        {
          collectDramas: collectDramas,
        },
        {
          where: {
            openid: data.openid,
          },
        }
      );
      if (result.affectedRows === 1) {
        this.ctx.body = {
          data: "取消收藏成功",
          code: 1,
        };
      } else {
        this.ctx.body = {
          data: "异常",
          code: 0,
        };
      }
    } else {
      this.ctx.body = {
        data: "未收藏",
        code: 0,
      };
    }
  }
  async getMyCollectDramaList() {
    const queryObj = this.ctx.query;

    let collectSql =
      "SELECT collectDramas FROM users WHERE openid = '" + queryObj.openid + "'";
    let collectDramas = await this.app.mysql.query(collectSql);
    collectDramas = collectDramas[0].collectDramas;
    console.log("collectDramas=============" + collectDramas);
    let collectArray = collectDramas.split(":");
    collectArray = collectArray.filter(function (s) {
      return s && s.trim();
    });

    const sql = "SELECT * FROM dramas WHERE Id IN (" +collectArray.toString()+")";
    const result = await this.app.mysql.query(sql);

    if(result.length > 0){
      this.ctx.body = { data: result, code: 1 };
    }else{
      this.ctx.body = { data: [], code: 1 };
    }
    
  }
}
module.exports = MainController;

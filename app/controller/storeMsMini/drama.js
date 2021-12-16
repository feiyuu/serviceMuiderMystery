"use strict";

const Controller = require("egg").Controller;

class MainController extends Controller {
  async index() {
    this.ctx.body = "hahahahaha mian";
  }
  async getFilterDramaList() {
    const data = this.ctx.query;
    console.log("data=====" + JSON.stringify(data));
    const results = await this.app.mysql.select("dramas", {
      where: JSON.parse(data.filters),
      orders: [
        ["id", "desc"], //降序desc，升序asc
      ],
      limit: Number(data.pageSize), //查询条数
      offset: Number(data.page) * Number(data.pageSize) - Number(data.pageSize), //数据偏移量（分页查询使用）
    });

    if (results.length > 0) {
      //超过七天，不是新上架
      for (let i = 0; i < results.length; i++) {
        if (results[i].addTime) {
          let dateAdd = new Date(
            Date.parse(results[i].addTime.replace(/-/g, "/"))
          );
          var day =
            (new Date().getTime() - dateAdd.getTime()) / (1000 * 60 * 60 * 24);
          console.log("day============" + day + results[i].dramaName);
          if (day > 7) {
            results[i].isNew = 0;
          } else {
            results[i].isNew = 1;
          }
        }
      }
      this.ctx.body = { code: 1, data: results };
    } else {
      this.ctx.body = { code: 1, data: [] };
    }
  }
  async getDramaDetail() {
    const data = this.ctx.query;
    let drama = await this.app.mysql.get("dramas", { Id: data.Id });
    drama.roles = JSON.parse(drama.roles) || [];

    //用户收藏的剧本
    let collectSql =
      "SELECT collectDramas FROM users WHERE openid = '" +
      this.ctx.openid +
      "'";
    let collectDramas = await this.app.mysql.query(collectSql);
    collectDramas = collectDramas[0].collectDramas;
    let collectArray = collectDramas.split(":");
    collectArray = collectArray.filter(function (s) {
      return s && s.trim();
    });
    const index = collectArray.indexOf(data.Id);
    drama.isCollect = index != -1;

    if (drama) {
      //超过七天不是新上架
      if (drama.addTime) {
        if (drama.addTime) {
          let dateAdd = new Date(Date.parse(drama.addTime.replace(/-/g, "/")));
          var day =
            (new Date().getTime() - dateAdd.getTime()) / (1000 * 60 * 60 * 24);
          console.log("day============" + day + drama.dramaName);
          if (day > 7) {
            drama.isNew = 0;
          } else {
            drama.isNew = 1;
          }
        }
      }
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

    //是否收藏
    let collectSql =
      "SELECT collectDramas FROM users WHERE openid = '" +
      this.ctx.openid +
      "'";
    let collectDramas = await this.app.mysql.query(collectSql);
    collectDramas = collectDramas[0].collectDramas;
    let collectArray = collectDramas.split(":");
    collectArray = collectArray.filter(function (s) {
      return s && s.trim();
    });
    const index = collectArray.indexOf(data.dramaId);

    if (index == -1) {
      collectDramas = collectDramas + ":" + data.dramaId;
      const result = await this.app.mysql.update(
        "users",
        {
          collectDramas: collectDramas,
        },
        {
          where: {
            openid: this.ctx.openid,
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
    //是否收藏
    let collectSql =
      "SELECT collectDramas FROM users WHERE openid = '" +
      this.ctx.openid +
      "'";
    let collectDramas = await this.app.mysql.query(collectSql);
    collectDramas = collectDramas[0].collectDramas;
    let collectArray = collectDramas.split(":");
    collectArray = collectArray.filter(function (s) {
      return s && s.trim();
    });
    const index = collectArray.indexOf(data.dramaId);

    if (index != -1) {
      //已收藏就移除
      delete collectArray[index];
      collectArray = collectArray.filter(function (s) {
        return s && s.trim();
      });
      collectDramas = collectArray.join(":");
      const result = await this.app.mysql.update(
        "users",
        {
          collectDramas: collectDramas,
        },
        {
          where: {
            openid: this.ctx.openid,
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

    //取出收藏剧本列表
    let collectSql =
      "SELECT collectDramas FROM users WHERE openid = '" +
      this.ctx.openid +
      "'";

    let collectDramas = await this.app.mysql.query(collectSql);

    console.log("collectDramas====" + JSON.stringify(collectDramas));
    if (!collectDramas[0].collectDramas) {
      this.ctx.body = { data: [], code: 1 };
      return;
    }

    collectDramas = collectDramas[0].collectDramas;
    let collectArray = collectDramas.split(":");
    collectArray = collectArray.filter(function (s) {
      return s && s.trim();
    });

    const sql =
      "SELECT * FROM dramas WHERE Id IN (" + collectArray.toString() + ")";
    const results = await this.app.mysql.query(sql);

    if (results.length > 0) {
      //超过七天为非新上架
      for (let i = 0; i < results.length; i++) {
        if (results[i].addTime) {
          let dateAdd = new Date(
            Date.parse(results[i].addTime.replace(/-/g, "/"))
          );
          var day =
            (new Date().getTime() - dateAdd.getTime()) / (1000 * 60 * 60 * 24);
          console.log("day============" + day + results[i].dramaName);
          if (day > 7) {
            results[i].isNew = 0;
          } else {
            results[i].isNew = 1;
          }
        }
      }
      this.ctx.body = { data: results, code: 1 };
    } else {
      this.ctx.body = { data: [], code: 1 };
    }
  }
}
module.exports = MainController;

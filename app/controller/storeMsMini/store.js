"use strict";
var http = require("http");

var appkey = "BC-1a482e3ac1ad499bbf4908be6d90b340";
var channel = "17jbs-order";
var content = "";

var options = {
  hostname: "rest-hangzhou.goeasy.io",
  path: "/publish",
  method: "POST",
  headers: {
    "Content-Type": "application/x-www-form-urlencoded",
  },
};

const Controller = require("egg").Controller;

class MainController extends Controller {
  async index() {
    this.ctx.body = "hahahahaha mian";
  }
  async getGoods() {
    const result = await this.app.mysql.select("goods", {
      where: { state: 10 },
      orders: [["id", "ASC"]],
    });
    if (result.length > 0) {
      this.ctx.body = { data: result, code: 1 };
    } else {
      this.ctx.body = { data: "", code: 2 };
    }
  }
  async getMyOrderList() {
    const data = this.ctx.query;
    const result = await this.app.mysql.select("orders", {
      where: {
        userId: data.openid,
      },
      orders: [["id", "DESC"]],
    });
    if (result.length > 0) {
      this.ctx.body = { data: result, code: 1 };
    } else {
      this.ctx.body = { data: "", code: 2 };
    }
  }
  async getOrderDetail() {
    const queryObj = this.ctx.query;
    const result = await this.app.mysql.get("orders", { Id: queryObj.orderId });

    if (result.Id) {
      this.ctx.body = { data: result, code: 1 };
    } else {
      this.ctx.body = { data: "", code: 2 };
    }
  }
  async updaTeOrder() {
    const data = this.ctx.request.body;
    const result = await this.app.mysql.update(
      "orders",
      {
        state: data.state,
        room: data.room,
      },
      {
        where: {
          Id: data.orderId,
        },
      }
    );
    console.log("cancelOrder  result ==  " + JSON.stringify(result));
    if (result.affectedRows === 1) {
      if (data.state == 30) {
        var queryParams =
          "appkey=" +
          appkey +
          "&channel=" +
          channel +
          "&content=" +
          content +
          data.room +
          "房间的用户刚刚在小卖铺消费了一笔订单";

        var req = http.request(options, (res) => {
          res.setEncoding("utf8");
          res.on("data", (result) => {
            console.log(`响应结果: ${result}`);
          });
        });
        req.on("error", (e) => {
          console.error(e);
        });
        req.write(queryParams);
        req.end();
      }

      this.ctx.body = { data: "操作成功", code: 1 };
    } else {
      this.ctx.body = { data: "", code: 2 };
    }
  }
  async placeOrder() {
    let data = this.ctx.request.body;
    console.log("placeOrder=====" + JSON.stringify(data));

    const result = await this.app.mysql.insert("orders", {
      ...data,
      order_time: new Date(+new Date() + 8 * 3600 * 1000)
        .toJSON()
        .substr(0, 19)
        .replace("T", " "),
      state: 10,
    });
    console.log("result ==  " + JSON.stringify(result));
    const success = result.affectedRows === 1;

    if (success) {
      this.ctx.body = { data: { orderId: result.insertId }, code: 1 };
    } else {
      this.ctx.body = { data: "下单失败", code: 2 };
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

"use strict";

const Controller = require("egg").Controller;

class MainController extends Controller {
  async index() {
    this.ctx.body = "hahahahaha mian";
  }
  async getGoods() {
    const data = this.ctx.query;
    console.log("getGoods=====" + JSON.stringify(data));
    const result = await this.app.mysql.select("goods", {
      where: data,
      orders: [["id", "DESC"]],
    });

    if (result.length > 0) {
      this.ctx.body = { data: result, code: 1 };
    } else {
      this.ctx.body = { data: "", code: 2 };
    }
  }
  async updaTeGoodsState() {
    const data = this.ctx.request.body;
    const result = await this.app.mysql.update(
      "goods",
      {
        state: data.state,
      },
      {
        where: {
          Id: data.goodsId,
        },
      }
    );
    console.log("updaTeGoods  result ==  " + JSON.stringify(result));
    if (result.affectedRows === 1) {
      this.ctx.body = { data: "操作成功", code: 1 };
    } else {
      this.ctx.body = { data: "", code: 2 };
    }
  }
  async deleteGoods() {
    const data = this.ctx.request.body;
    const result = await this.app.mysql.delete("goods", {
      Id: data.goodsId,
    });
    if (result.affectedRows === 1) {
      this.ctx.body = { data: "操作成功", code: 1 };
    } else {
      this.ctx.body = { data: "", code: 2 };
    }
  }
  async updaTeGoods() {
    let data = this.ctx.request.body;
    console.log("updaTeGoods=====" + JSON.stringify(data));
    let result = {};
    if (data.Id == -1) {
      delete data["Id"];
      console.log("updaTeGoods=====" + JSON.stringify(data));
      result = await this.app.mysql.insert("goods", data);
    } else {
      let options = {
        where: {
          Id: data.Id,
        },
      };
      result = await this.app.mysql.update("goods", data, options);
    }
    console.log("updaTeGoods  result ==  " + JSON.stringify(result));
    if (result && result.affectedRows === 1) {
      this.ctx.body = { data: "操作成功", code: 1 };
    } else {
      this.ctx.body = { data: "", code: 2 };
    }
  }
  async getOrderList() {
    const data = this.ctx.query;
    console.log("getOrderList=====" + JSON.stringify(data));
    const result = await this.app.mysql.select("orders", {
      where: data,
      orders: [["id", "DESC"]],
    });
    if (result.length > 0) {
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
      },
      {
        where: {
          Id: data.orderId,
        },
      }
    );
    console.log("updaTeOrder  result ==  " + JSON.stringify(result));
    if (result.affectedRows === 1) {
      this.ctx.body = { data: "操作成功", code: 1 };
    } else {
      this.ctx.body = { data: "", code: 2 };
    }
  }

  async getRoomDetail() {
    const data = this.ctx.query;
    console.log("getRoomDetail=====" + JSON.stringify(data));
    const result = await this.app.mysql.select("rooms", {
      where: data,
      orders: [["id", "desc"]],
    });
    if (result) {
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
  async deleteRoom() {
    const data = this.ctx.request.body;
    const result = await this.app.mysql.delete("rooms", {
      Id: data.roomId,
    });
    if (result.affectedRows === 1) {
      this.ctx.body = { data: "操作成功", code: 1 };
    } else {
      this.ctx.body = { data: "", code: 2 };
    }
  }
  async updaTeRoom() {
    let data = this.ctx.request.body;
    console.log("updaTeRoom=====" + JSON.stringify(data));
    let result = {};
    if (data.Id == -1) {
      delete data["Id"];
      console.log("updaTeRoom=====" + JSON.stringify(data));
      result = await this.app.mysql.insert("rooms", data);
    } else {
      let options = {
        where: {
          Id: data.Id,
        },
      };
      result = await this.app.mysql.update("rooms", data, options);
    }
    console.log("updaTeRoom  result ==  " + JSON.stringify(result));
    if (result && result.affectedRows === 1) {
      this.ctx.body = { data: "操作成功", code: 1 };
    } else {
      this.ctx.body = { data: "", code: 2 };
    }
  }
}
module.exports = MainController;

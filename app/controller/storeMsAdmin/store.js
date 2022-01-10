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

    if (result) {
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
    if (result) {
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

    let success = result.affectedRows === 1;
    
    if (data.state == 60) {
      const conn = await this.app.mysql.beginTransaction();
      try {
        //退款，扣积分
        let sqlUpdata =
          "UPDATE users SET balance = balance + " +
          data.charge +
          ",integral = integral - " +
          data.charge +
          " WHERE openid = '" +
          data.userId +
          "'";
        await conn.query(sqlUpdata);
        //插入资金明细记录
        await conn.insert("purchase_record", {
          recordUserId: data.userId,
          charge: data.charge,
          recordName: "退还小卖铺消费：+" + data.charge,
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
    }

    if (success) {
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

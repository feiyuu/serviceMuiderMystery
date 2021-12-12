"use strict";

const Controller = require("egg").Controller;

class MainController extends Controller {
  async index() {
    this.ctx.body = "hahahahaha mian";
  }

  async getTeamList() {
    const params = this.ctx.query;

    console.log("getTeamList=====" + JSON.stringify(params));
    const result = await this.app.mysql.select("organize_team", {
      where: params,
      orders: [["id", "DESC"]],
    });

    if (result.length > 0) {
      for (var i = 0; i < result.length; i++) {
        let teamUsersCountSql =
          "SELECT COUNT(*) AS count FROM teamUsers WHERE teamUsers.organizeTeamId= " +
          result[i].Id;
        let teamUsersCount = await this.app.mysql.query(teamUsersCountSql);
        result[i].joinedCount = teamUsersCount[0].count;
      }

      this.ctx.body = { code: 1, data: result };
    } else {
      this.ctx.body = { code: 2, data: [] };
    }
  }

  async getTeamDetail() {
    const params = this.ctx.query;
    let result = await this.app.mysql.get("organize_team", { Id: params.Id });
    if (result) {
      let drama = await this.app.mysql.get("dramas", {
        Id: result.teamDramaId,
      });
      result.drama = drama;
      this.ctx.body = { code: 1, data: result };
    } else {
      this.ctx.body = { code: 2, data: "查询失败" };
    }
  }
  async insertTeam() {
    let data = this.ctx.request.body;
    console.log("insertTeam=====" + JSON.stringify(data));

    //查询同一天同一场次的组局数
    const sqlExceedTeam =
      "SELECT COUNT(*) AS count FROM organize_team WHERE startDate = '" +
      data.startDate +
      "' AND startSession = '" +
      data.startSession +
      "'";
    const teamCountData = await this.app.mysql.query(sqlExceedTeam);
    //查询总房间数
    const sqlExceedRoom = "SELECT COUNT(*) AS count FROM rooms ";
    const roomCountData = await this.app.mysql.query(sqlExceedRoom);

    //同一天同一场次的组局数不得超过总房间数
    if (teamCountData[0].count > roomCountData[0].count) {
      this.ctx.body = {
        data:
          data.startDate +
          "" +
          data.startSession +
          " 这个场次的组局太多了，房间不够",
        code: 2,
      };
      return;
    }

    const result = await this.app.mysql.insert("organize_team", data);

    console.log("insertTeam  result ==  " + JSON.stringify(result));
    if (result && result.affectedRows === 1) {
      this.ctx.body = { data: "操作成功", code: 1 };
    } else {
      this.ctx.body = { data: "", code: 2 };
    }
  }
  async updateTeam() {
    let data = this.ctx.request.body;
    console.log("updateTeam=====" + JSON.stringify(data));

    //查询同一天同一场次的组局数
    const sqlExceedTeam =
      "SELECT COUNT(*) AS count FROM organize_team WHERE startDate = '" +
      data.startDate +
      "' AND startSession = '" +
      data.startSession +
      "'";
    const teamCountData = await this.app.mysql.query(sqlExceedTeam);
    //查询总房间数
    const sqlExceedRoom = "SELECT COUNT(*) AS count FROM rooms ";
    const roomCountData = await this.app.mysql.query(sqlExceedRoom);

    //同一天同一场次的组局数不得超过总房间数
    if (teamCountData[0].count > roomCountData[0].count) {
      this.ctx.body = {
        data:
          data.startDate +
          "" +
          data.startSession +
          " 这个场次的组局太多了，房间不够",
        code: 2,
      };
      return;
    }

    let options = {
      where: {
        Id: data.Id,
      },
    };
    const result = await this.app.mysql.update("organize_team", data, options);

    console.log("updaTeGoods  result ==  " + JSON.stringify(result));
    if (result && result.affectedRows === 1) {
      this.ctx.body = { data: "操作成功", code: 1 };
    } else {
      this.ctx.body = { data: "", code: 2 };
    }
  }
  async updateTeamState() {
    const data = this.ctx.request.body;

    if(data.state == 30){
      let sqlUpdata =
        "UPDATE controller_users SET dmHot = dmHot + 1 WHERE Id = '" +
        data.dmId +
        "'";
      await this.app.mysql.query(sqlUpdata);
    }

    const result = await this.app.mysql.update(
      "organize_team",
      {
        status: data.state,
      },
      {
        where: {
          Id: data.TeamId,
        },
      }
    );
    console.log("updateTeamState  result ==  " + JSON.stringify(result));
    if (result.affectedRows === 1) {
      this.ctx.body = { data: "操作成功", code: 1 };
    } else {
      this.ctx.body = { data: "", code: 2 };
    }
  }
}
module.exports = MainController;

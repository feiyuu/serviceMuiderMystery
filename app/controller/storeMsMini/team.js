"use strict";

const Controller = require("egg").Controller;

class MainController extends Controller {
  async index() {
    this.ctx.body = "hahahahaha mian";
  }

  async getTeamList() {
    const openid = this.ctx.openid;
    let sql =
      "SELECT *,organize_team.Id as Id,(SELECT COUNT(*) FROM teamusers WHERE teamusers.organizeTeamId = organize_team.Id)joinedCount,(SELECT COUNT(*) FROM teamusers WHERE teamusers.organizeTeamId = organize_team.Id AND teamusers.teamUserId = '" +
      openid +
      "')" +
      "joinedMy FROM organize_team LEFT JOIN dramas ON organize_team.teamDramaId = dramas.Id " +
      "WHERE organize_team.status= 10 ORDER BY organize_team.id DESC ";
    let results = await this.app.mysql.query(sql);
    if (results) {
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
      this.ctx.body = { code: 2, data: "查询失败" };
    }
  }
  async getMyTeamList() {
    const openid = this.ctx.openid;
    let sql =
      "SELECT *,organize_team.Id as Id,(SELECT COUNT(*) FROM teamusers WHERE teamusers.organizeTeamId = organize_team.Id )joinedCount FROM organize_team LEFT JOIN dramas ON organize_team.teamDramaId = dramas.Id " +
      "WHERE organize_team.Id IN (SELECT organizeTeamId FROM teamusers WHERE teamusers.teamUserId = '" +
      openid +
      "')" +
      " ORDER BY organize_team.id DESC ";

    let results = await this.app.mysql.query(sql);
    if (results) {
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
      this.ctx.body = { code: 2, data: "查询失败" };
    }
  }
  async getTeamDetail() {
    // "LEFT JOIN rooms ON organize_team.roomId = rooms.Id " +

    const Id = this.ctx.query.Id;
    let sql =
      "SELECT * FROM organize_team LEFT JOIN dramas ON organize_team.teamDramaId = dramas.Id " +
      "LEFT JOIN controller_users ON organize_team.DMId = controller_users.Id " +
      "WHERE organize_team.Id= " +
      Id;

    let result = await this.app.mysql.query(sql);

    if (result.length > 0) {
      //解析roles json
      result[0].roles = JSON.parse(result[0].roles) || [];
      //从uer表中查询参与组局的用户信息
      let sqlusers =
        "SELECT * FROM teamUsers LEFT JOIN users ON teamUsers.teamUserId = users.openid " +
        "WHERE teamUsers.organizeTeamId= " +
        Id;
      let users = await this.app.mysql.query(sqlusers);
      result[0].teamUsers = users;
      if (users && users.length > 0) {
        result[0].joined = false;
        for (var i = 0; i < users.length; i++) {
          if (this.ctx.openid == users[i].openid) {
            result[0].joined = true;
          }
        }
      }

      //超过七天非新上架
      for (let i = 0; i < result.length; i++) {
        if (result[i].addTime) {
          let dateAdd = new Date(
            Date.parse(result[i].addTime.replace(/-/g, "/"))
          );
          var day =
            (new Date().getTime() - dateAdd.getTime()) / (1000 * 60 * 60 * 24);
          console.log("day============" + day + result[i].dramaName);
          if (day > 7) {
            result[i].isNew = 0;
          } else {
            result[i].isNew = 1;
          }
        }
      }

      this.ctx.body = { code: 1, data: result[0] };
    } else {
      this.ctx.body = { code: 2, data: "查询失败" };
    }
  }
  async joinTeam() {
    let data = this.ctx.request.body;
    console.log("datapay=====" + JSON.stringify(data));

    data.teamUserId = this.ctx.openid;
    const result = await this.app.mysql.insert("teamusers", {
      ...data,
      teamUserJoinTime: new Date(+new Date() + 8 * 3600 * 1000)
        .toJSON()
        .substr(0, 19)
        .replace("T", " "),
    });
    const success = result.affectedRows === 1;
    if (success) {
      this.ctx.body = {
        data: "",
        code: 1,
      };
    } else {
      this.ctx.body = {
        data: "异常",
        code: 0,
      };
    }
  }
}
module.exports = MainController;

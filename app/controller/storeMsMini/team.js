"use strict";

const Controller = require("egg").Controller;

class MainController extends Controller {
  async index() {
    this.ctx.body = "hahahahaha mian";
  }

  async getTeamList() {
    let sql =
      "SELECT *,organize_team.Id as Id,(SELECT COUNT(*) FROM teamusers WHERE teamusers.organizeTeamId = organize_team.Id )joinedCount FROM organize_team LEFT JOIN dramas ON organize_team.teamDramaId = dramas.Id " +
      "WHERE organize_team.status= 10 ORDER BY organize_team.id ASC ";
    let result = await this.app.mysql.query(sql);
    if (result) {
      this.ctx.body = { code: 1, data: result };
    } else {
      this.ctx.body = { code: 2, data: "查询失败" };
    }
  }
  async getMyTeamList() {
    const openid = this.ctx.query.openid;
    let sql =
      "SELECT *,organize_team.Id as Id,(SELECT COUNT(*) FROM teamusers WHERE teamusers.organizeTeamId = organize_team.Id )joinedCount FROM organize_team LEFT JOIN dramas ON organize_team.teamDramaId = dramas.Id " +
      "WHERE organize_team.Id IN (SELECT organizeTeamId FROM teamusers WHERE teamusers.teamUserId = '"+openid+"')" +
      " ORDER BY organize_team.id DESC ";

    let result = await this.app.mysql.query(sql);
    if (result) {
      this.ctx.body = { code: 1, data: result };
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

    let roles = await this.app.mysql.select("roles", {
      where: { dramaId: result[0].teamDramaId },
    });
    result[0].roles = roles;

    let sqlusers =
      "SELECT * FROM teamUsers LEFT JOIN users ON teamUsers.teamUserId = users.openid " +
      "WHERE teamUsers.organizeTeamId= " +
      Id;
    let users = await this.app.mysql.query(sqlusers);
    result[0].teamUsers = users;

    if (result) {
      this.ctx.body = { code: 1, data: result[0] };
    } else {
      this.ctx.body = { code: 2, data: "查询失败" };
    }
  }
  async joinTeam() {
    let data = this.ctx.request.body;
    console.log("datapay=====" + JSON.stringify(data));

    if (
      data.teamUserId == "undefined" ||
      data.teamUserId == "" ||
      data.teamUserId == null
    ) {
      this.ctx.body = {
        data: "请登录后再试",
        code: 0,
      };
      return;
    }
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

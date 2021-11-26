'use strict';

const Controller = require('egg').Controller;

class HomeController extends Controller {
  async index() {
    const { ctx } = this;

    ctx.body = "api hi";
  }
  async getArticleList() {
    let sql = 'SELECT article.id as id,' +
      'article.title as title,' +
      'article.introduce as introduce,' +
      "FROM_UNIXTIME(article.addTime,'%Y-%m-%d') as addTime," +
      'article.view_count as view_count ,' +
      '.type.typeName as typeName ' +
      'FROM article LEFT JOIN type ON article.type_id = type.Id'

    const results = await this.app.mysql.query(sql)

    this.ctx.body = {
      data: results
    }
  }

  async getArticleById() {
    //先配置路由的动态传值，然后再接收值
    let id = this.ctx.params.id
    let sql = 'SELECT article.id as id,' +
      'article.title as title,' +
      'article.introduce as introduce,' +
      'article.article_content as article_content,' +
      "FROM_UNIXTIME(article.addTime,'%Y-%m-%d') as addTime," +
      'article.view_count as view_count ,' +
      'type.typeName as typeName ,' +
      'type.id as typeId,' +
      "publisher.phone as phone," +
      "publisher.publisherName as publisherName " +
      'FROM article LEFT JOIN type ON article.type_id = type.Id ' +
      "LEFT JOIN publisher ON article.publisher_id = publisher.Id " +
      'WHERE article.id=' + id

    const result = await this.app.mysql.query(sql)
    this.ctx.body = { data: result }
    this.updateViewCount(result[0].id,result[0].view_count);
  }
  //更新点击量
  async updateViewCount(id,view_count) {
    let options = {
      where: {
        Id: id,
      },
    };
    const result = await this.app.mysql.update("article", {view_count:view_count+1}, options);
  }
  //得到类别名称和编号
  async getTypeInfo() {
    const result = await this.app.mysql.select('type',{orders:[['id']]})
    this.ctx.body = { data: result }
  }
  //获取剧本所属的发行商
  async getPublisherById() {
    let id = this.ctx.params.id
    const publisher = await this.app.mysql.get("publisher",{id});
    this.ctx.body = { data: publisher };
  }
  //根据类别ID获得剧本列表
  async getListById() {
    let id = this.ctx.params.id
    let sql = 'SELECT article.id as id,' +
      'article.title as title,' +
      'article.introduce as introduce,' +
      "FROM_UNIXTIME(article.addTime,'%Y-%m-%d' ) as addTime," +
      'article.view_count as view_count ,' +
      'type.typeName as typeName ' +
      'FROM article LEFT JOIN type ON article.type_id = type.Id ' +
      'WHERE type_id=' + id
    const result = await this.app.mysql.query(sql)
    this.ctx.body = { data: result }
  }
}

module.exports = HomeController;

const Controller = require("egg").Controller;
const qiniu = require('qiniu');

class HomeController extends Controller {
  async index() {
    const { ctx } = this;

    ctx.body = "api hi";
  }

  async getPicAuth() {
    const data = this.ctx.query;

    var accessKey = config.accessKey;
    var secretKey = config.secretKey;
    var mac = new qiniu.auth.digest.Mac(accessKey, secretKey);
    //自定义凭证有效期（示例2小时，expires单位为秒，为上传凭证的有效时间）
    var options = {
      scope: config.scope,
      expires: 10*60,
    };
    var putPolicy = new qiniu.rs.PutPolicy(options);
    var uploadToken = putPolicy.uploadToken(mac);

    console.log("getObjectUrl=====key=====" + uploadToken);
    if (uploadToken) {
      this.ctx.body = { data: uploadToken, code: 1 };
    } else {
      this.ctx.body = { data: uploadToken, code: 2 };
    }
  }
}
module.exports = HomeController;

var config = {
  accessKey: "cTCk49qDPC26a_PMJgA9KTuyYSeNmGRkWJ8o5PQq",
  secretKey: "7EuogD91nxRwN5nt4G0ybDHa1BKkzVE_h_yleGqt",
  scope: "17jbs-pic",
};

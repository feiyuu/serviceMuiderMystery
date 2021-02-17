'use strict';

/** @type Egg.EggPlugin */
// module.exports = {
//   // had enabled by egg
//   // static: {
//   //   enable: true,
//   // }
// };
//phpstudy 百度下载安装后，启动mysql，就有了配置项
exports.mysql = {
  enable : true,
  package : 'egg-mysql'
}
exports.cors = {
  enable : true,
  package : 'egg-cors'
}
'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  require('./router/storeMsMini')(app)
  require('./router/storeMsAdmin')(app)
  require('./router/common')(app)
};

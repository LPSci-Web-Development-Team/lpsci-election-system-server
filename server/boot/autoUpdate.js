'use strict';

module.exports = function (server) {
  server.dataSources.db.autoupdate();
  console.log('Auto update completed.');
};

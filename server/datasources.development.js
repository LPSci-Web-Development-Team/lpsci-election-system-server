'use strict';

module.exports = {
  db: {
    host: process.env.DB_HOST_DEVELOPMENT,
    port: 3306,
    url: '',
    database: process.env.DB_DATABASE_DEVELOPMENT,
    password: process.env.DB_PASSWORD_DEVELOPMENT,
    name: 'db',
    user: process.env.DB_USER_DEVELOPMENT,
    connector: 'mysql',
  },
};

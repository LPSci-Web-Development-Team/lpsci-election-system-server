'use strict';

module.exports = {
  db: {
    host: process.env.DB_HOST_PRODUCTION,
    port: 3306,
    url: '',
    database: process.env.DB_DATABASE_PRODUCTION,
    password: process.env.DB_PASSWORD_PRODUCTION,
    name: 'db',
    user: process.env.DB_USER_PRODUCTION,
    connector: 'mysql',
  },
};

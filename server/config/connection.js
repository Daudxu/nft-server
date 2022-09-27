const sqlite3 = require('sqlite3');
const path = require('path');

// const $dbInfo      = require('./info');
// const pool = new sqlite3.Database( path.resolve(__dirname, '/database/nft.db'));

var db = new sqlite3.Database( path.resolve(__dirname, '../database/nft.db') );

// 链接数据库
const getConnection = (callback) => {
  pool.getConnection(function (err, connection) {
    if (err) {
      return console.log('[query] - :' + err);
    }
    typeof callback === 'function' && callback(connection)
  })
}

// 状态码
const statusCode = {
  200: 'Successful operation',
  201: 'Incomplete parameters',
  203: 'Login information has expired',
  301: 'Moved Permanently',
  404: 'Not Found',
  500: 'Internal Server Error'
}

module.exports = {
  queryAllSQL (sql, callback) {
      db.all(sql, function(err, rows) {
        callback(err, rows)
        // if (err) {
        //   return console.log('[query] - :' + err);
        // } else {
        //   typeof callback === 'function' && callback(rows)
        //   // connection.release();
        // }
      });
  },
  queryGetSQL (sql, callback) {
      db.get(sql, function(err, rows) {
        callback(err, rows)
      });
  },
  queryRunSQL (sql, callback) {
      db.run(sql, function(err, rows) {
        callback(err, rows)
      });
  },

  dataFormat (data, status = 200) {
    return {
      "code": status,
      "data": data,
      "message": statusCode[status],
      "serverTime": new Date()
    }
  }
}

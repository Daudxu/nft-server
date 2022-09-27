const userModel = require('../model/User')
const { queryGetSQL, dataFormat } = require('../../config/connection')
// const { MD5_SUFFIX, md5, secretKey } = require('../utils/jwt/config')
const MD5 = require('md5')
const Token = require('../utils/token')
module.exports = {
  login: (req, res, next) => {
    if(req.body.name && req.body.password){
      var userSql = userModel.getUser(req.body.name, MD5(req.body.password))
      queryGetSQL(userSql, (err, data) => {
           if (err) return next(err);
           if(data) {
            res.json(dataFormat({token:Token.encrypt({id:data.id},'1d')}))
           }else{
            res.json(dataFormat([], 404))
           }
      })
    }else{
      res.json(dataFormat([], 201))
    }
  },
}
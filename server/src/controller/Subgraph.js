const subgraphModel = require('../model/Subgraph')
const { queryAllSQL, queryGetSQL, queryRunSQL, dataFormat } = require('../../config/connection');
const Token = require('../utils/token')
const MD5 = require('md5')

module.exports = {
  getSubgraph: async (req, res, next) => {
    let sql = subgraphModel.getAllSubgraph(req.body)
      queryAllSQL(sql, (err, data) => { 
        if (err) return next(err);
        res.json(dataFormat(data, 200))
     })
  },
  getSubgraphById: async (req, res, next) => {
    if(req.params.id){
      let SubgraphSql = subgraphModel.getSubgraphById(req.params.id)
      queryGetSQL(SubgraphSql, async (err, data) => { 
        if (err) return next(err);
        res.json(dataFormat(data, 200))
      })
    }else{
      res.json(dataFormat([], 201))
    }
  },
  addSubgraph: async (req, res, next) => {
    let tokenData = Token.decrypt(req.get('authorization')); 
    if (tokenData.token) {
        if(req.body.name && req.body.description && req.body.apiurl && req.body.apisql){
          var dateTime = Math.floor(Date.now() / 1000)
          const apiKeyStr = MD5(req.body.apiurl+dateTime)
          var parmas = {
            name: req.body.name,
            description: req.body.description,
            apikey: apiKeyStr,
            apiurl: req.body.url,
            apisql: req.body.sort,
            create_date: dateTime,
            update_date: dateTime,
          }
          let SubgraphSql = subgraphModel.addSubgraph(parmas)
          queryRunSQL(SubgraphSql, async (err, data) => { 
               if (err) return next(err);
               res.json(dataFormat(data, 200))
          })
        }else{
          res.json(dataFormat([], 201))
        }
    }else{
      res.json(dataFormat([], 203))
    }
  },
  updateSubgraph: async (req, res, next) => {
    let tokenData = Token.decrypt(req.get('authorization')); 
    if (tokenData.token) {
        var parmas = ""
        var dateTime = Math.floor(Date.now() / 1000)
        
        if( req.params.id && req.body.name && req.body.description && req.body.apiurl && req.body.apisql){
            parmas = {
                name: req.body.name,
                description: req.body.description,
                apiurl: req.body.apiurl,
                apisql: req.body.apisql,
                update_date: dateTime,
            }
            let SubgraphSql = subgraphModel.updateSubgraph(parmas, req.params.id)
            queryRunSQL(SubgraphSql, async (err, data) => { 
                if (err) return next(err);
                res.json(dataFormat(data, 200))
            })
        }else{
            res.json(dataFormat([], 201))
        }
    }else{
      res.json(dataFormat([], 203))
    }
  },

  deleteSubgraph: async (req, res, next) => {
    let tokenData = Token.decrypt(req.get('authorization')); 
    if (tokenData.token) {
        let sql = subgraphModel.delSubgraph(req.params.id)
        queryRunSQL(sql, (err, data) => { 
            if (err) return next(err);
            res.json(dataFormat(data, 200))
        })
    }else{
      res.json(dataFormat([], 203))
    }
  }
}
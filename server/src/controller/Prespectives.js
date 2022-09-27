const prespectivesModel = require('../model/Prespectives')
const { queryAllSQL, queryGetSQL, queryRunSQL, dataFormat } = require('../../config/connection');
const Token = require('../utils/token')

const site = "https://knowledge.serenity-research.com"  

module.exports = {
  getPrespectives: async (req, res, next) => {
    let sql = prespectivesModel.getAllPrespectives(req.body)
      queryAllSQL(sql, (err, data) => { 
        if (err) return next(err);
        res.json(dataFormat(data, 200))
     })
  },
  getPrespectivesById: async (req, res, next) => {
    if(req.params.id){
      let prespectivesSql = prespectivesModel.getPrespectivesById(req.params.id)
      queryGetSQL(prespectivesSql, async (err, data) => { 
        if (err) return next(err);
        res.json(dataFormat(data, 200))
      })
    }else{
      res.json(dataFormat([], 201))
    }
  },
  addPrespectives: async (req, res, next) => {
    let tokenData = Token.decrypt(req.get('authorization')); 
    if (tokenData.token) {
        if(req.body.title && req.body.description && req.files.image.length > 0 && req.body.url){
          var dateTime = Math.floor(Date.now() / 1000)
          var parmas = {
            title: req.body.title,
            description: req.body.description,
            image: site+'/img/'+req.files.image[0].filename,
            url: req.body.url,
            sort: req.body.sort,
            date: dateTime,
            update_date: dateTime,
          }
          let prespectivesSql = prespectivesModel.addPrespectives(parmas)
          queryRunSQL(prespectivesSql, async (err, data) => { 
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
  updatePrespectives: async (req, res, next) => {
    let tokenData = Token.decrypt(req.get('authorization')); 
    if (tokenData.token) {
            var parmas = ""
            var dateTime = Math.floor(Date.now() / 1000)
          
            if( req.params.id && req.body.title && req.body.description && typeof(req.files.image) !== "undefined" && req.body.url){
              parmas = {
                title: req.body.title,
                description: req.body.description,
                image: site+'/img/'+req.files.image[0].filename,
                url: req.body.url,
                sort: req.body.sort,
                update_date: dateTime,
              }
            }else{
              parmas = {
                title: req.body.title,
                description: req.body.description,
                url: req.body.url,
                sort: req.body.sort,
                update_date: dateTime,
              }
            }

            let prespectivesSql = prespectivesModel.updatePrespectives(parmas, req.params.id)
            if(parmas && req.params.id){
              queryRunSQL(prespectivesSql, async (err, data) => { 
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
  deletePrespectives: async (req, res, next) => {
    let tokenData = Token.decrypt(req.get('authorization')); 
    if (tokenData.token) {
        let sql = prespectivesModel.delPrespectives(req.params.id)
        queryRunSQL(sql, (err, data) => { 
            if (err) return next(err);
            res.json(dataFormat(data, 200))
        })
    }else{
      res.json(dataFormat([], 203))
    }
  }
}
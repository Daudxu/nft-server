const assetsModel = require('../model/Assets')
const { queryAllSQL, queryGetSQL, queryRunSQL, dataFormat } = require('../../config/connection');
const f = require('../utils/hash')
const fs = require('fs'); 
const Web3 = require('web3')
const Token = require('../utils/token')
const site = "https://knowledge.serenity-research.com"  
const MetadataHex = require('../utils/metadataHex')

module.exports = {
  getAllAsssets: async (req, res, next) => {
    let sql = assetsModel.getAllAsssets(req.body)
    await  queryAllSQL(sql, (err, data) => {
       if (err) return next(err)
       res.json(dataFormat(data)) 
      })
  },
  getAsssetsById: async (req, res, next) => {
    if(req.params.id){
      let sql = assetsModel.getAsssetsById(req.params.id)
      queryGetSQL(sql, async (err, data) => { 
           if (err) return next(err);
           res.json(dataFormat(data, 200))
      })
    }else{
      res.json(dataFormat([], 201))
    }
  },
  
  addAsssets: async (req, res, next) => {
    let tokenData = Token.decrypt(req.get('authorization')); 
    if (tokenData.token) {
        if(req.body.name && req.body.description && req.body.content && req.files.image && req.files.doc_path){
            let getAssetsCountSql = assetsModel.getAssetsCount()
            queryGetSQL(getAssetsCountSql, async (err, data) => { 
                if (err) return next(err);
                var sumCount = data.sumCount
                var tokenId = Number(sumCount)+1
                let hashVal = f.hashFileSha256Async(`../public/doc/${tokenId}.xyz`,f.algorithmType.SHA256)
                var metadata = {
                  "name": req.body.name,
                  "description": req.body.description, 
                  "external_url": "",
                  "image": site+"/images/"+tokenId+".png",
                  "tokenId" : tokenId,
                  "attributes": [
                      {
                        "trait_type": "hash", 
                        "value": hashVal
                      }
                  ]
                }
                var metadataJson = JSON.stringify(metadata); 
                var hexTokenId = MetadataHex.getMetadataHex(tokenId);
                fs.writeFile("./public/metadata/"+hexTokenId+".json", metadataJson, 'utf8', function (err) { 
                  if (err) { 
                      console.log("An error occured while writing JSON Object to File."); 
                      return console.log(err); 
                  }
                });
                var parmas = {
                  name: req.body.name,
                  description: req.body.description,
                  image: site+"/images/"+tokenId+".png",
                  doc_path: site+"/doc/"+tokenId+".xyz",
                  metadata_path: site+"/metadata/"+hexTokenId+".json",
                  content: req.body.content,
                  date: Math.floor(Date.now() / 1000),
                  update_date: Math.floor(Date.now() / 1000)
                }
                let addAssetsSql = assetsModel.addAssets(parmas)
                queryRunSQL(addAssetsSql, async (err, data) => {
                  if (err) return next(err);
                  res.json(dataFormat(data, 200))
                })
            })
        }else{
          res.json(dataFormat(data, 201))
        }
    }else{
       res.json(dataFormat([], 203))
    }
  },

  updateAsssets: async (req, res, next) => {
    let tokenData = Token.decrypt(req.get('authorization')); 
    if (tokenData.token) {
      var tokenId =  req.params.id
      if(tokenId && req.body.name && req.body.description && req.body.content) {
        var hashVal = f.hashFileSha256Async(`../public/doc/${tokenId}.xyz`,f.algorithmType.SHA256)
        var metadata = {
                "name": req.body.name,
                "description": req.body.description, 
                "external_url": "",
                "image": site+"/images/"+tokenId+".png",
                "tokenId" : tokenId,
                "attributes": [
                    {
                      "trait_type": "hash", 
                      "value": hashVal
                    }
                ]
              }
              var metadataJson = JSON.stringify(metadata);
              var hexTokenId = MetadataHex.getMetadataHex(tokenId);
              fs.writeFile("./public/metadata/"+hexTokenId+".json", metadataJson, 'utf8', function (err) { 
                if (err) { 
                    console.log("An error occured while writing JSON Object to File."); 
                    return console.log(err); 
                }
              });
          if(typeof(req.files.image) !== "undefined" && typeof(req.files.doc_path) !== "undefined") {
              var parmas = {
                name: req.body.name,
                description: req.body.description,
                image: site+"/images/"+tokenId+".png",
                doc_path: site+"/doc/"+tokenId+".xyz",
                metadata_path: site+"/metadata/"+hexTokenId+".json",
                content: req.body.content,
                update_date: Math.floor(Date.now() / 1000)
              }
              let updateAssetsSql = assetsModel.updateAssets(parmas,req.params.id)
              queryRunSQL(updateAssetsSql, async (err, data) => { 
                  if (err) return next(err);
                  res.json(dataFormat(data, 200))
              })
          } else if(typeof(req.files.image) !== "undefined") {
              var parmas = {
                name: req.body.name,
                description: req.body.description,
                image: site+"/images/"+tokenId+".png",
                metadata_path: site+"/metadata/"+hexTokenId+".json",
                content: req.body.content,
                update_date: Math.floor(Date.now() / 1000)
              }
              let updateAssetsSql = assetsModel.updateAssets(parmas,req.params.id)
              queryRunSQL(updateAssetsSql, async (err, data) => { 
                  if (err) return next(err);
                  res.json(dataFormat(data, 200))
              })
          } else if(typeof(req.files.doc_path) !== "undefined") {
              var parmas = {
                name: req.body.name,
                description: req.body.description,
                doc_path: site+"/doc/"+tokenId+".xyz",
                metadata_path: site+"/metadata/"+hexTokenId+".json",
                content: req.body.content,
                update_date: Math.floor(Date.now() / 1000)
              }
              let updateAssetsSql = assetsModel.updateAssets(parmas,req.params.id)
              queryRunSQL(updateAssetsSql, async (err, data) => { 
                  if (err) return next(err);
                  res.json(dataFormat(data, 200))
              })
          } else {
              var parmas = {
                name: req.body.name,
                description: req.body.description,
                metadata_path: site+"/metadata/"+hexTokenId+".json",
                content: req.body.content,
                update_date: Math.floor(Date.now() / 1000)
              }
              let updateAssetsSql = assetsModel.updateAssets(parmas,req.params.id)
              queryRunSQL(updateAssetsSql, async (err, data) => { 
                  if (err) return next(err);
                  res.json(dataFormat(data, 200))
              })
          }
      } else {
        res.json(dataFormat(data, 201))
      }
    }else{
      res.json(dataFormat([], 203))
    }
  },

}
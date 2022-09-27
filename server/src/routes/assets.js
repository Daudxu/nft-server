const express = require('express')
const router = express.Router()

const assets = require('../controller/Assets')
const { jsonParser, urlencodedParser } = require('../utils/postSetting')

const multer = require('multer')
const assetsModel = require('../model/Assets')
const { queryAllSQL, queryGetSQL, queryRunSQL, dataFormat } = require('../../config/connection')

const fileStorageEngine = multer.diskStorage({
    destination: (req, file, cb) => {
      if(file.mimetype === "application/pdf"){
        cb(null, "./public/doc"); 
      }else{
        cb(null, "./public/images"); 
      }
    },
    filename: (req, file, cb) => {
        let sql = assetsModel.getAssetsCount()
        queryGetSQL(sql, async (err, data) => { 
             if (err) return next(err);
             var sumCount = data.sumCount
             if(file.mimetype === "application/pdf"){
                cb(null, Number(sumCount)+1+'.xyz');
             }else{
                cb(null, Number(sumCount)+1+'.png');
             }
        })
    },
});

const upload = multer({ storage: fileStorageEngine });

const fileStorageEngineUpdate = multer.diskStorage({
    destination: (req, file, cb) => {
      if(file.mimetype === "application/pdf"){
        cb(null, "./public/doc"); 
      }else{
        cb(null, "./public/images"); 
      }
    },
    filename: (req, file, cb) => {
        if(file.mimetype === "application/pdf"){
          cb(null, Number(req.params.id)+'.xyz');
        }else{
          cb(null, Number(req.params.id)+'.png');
        }
    },
  });
  
const uploadFile = multer({ storage: fileStorageEngineUpdate });

router.get('/', assets.getAllAsssets)
router.get('/:id', assets.getAsssetsById)
router.post('/', upload.fields([
    { name: 'image'},
    { name: 'doc_path'} 
  ]), assets.addAsssets)
router.put('/:id', uploadFile.fields([
    { name: 'image'},
    { name: 'doc_path'} 
  ]), assets.updateAsssets)

module.exports = router


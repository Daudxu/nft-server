const express = require('express')
const router = express.Router()
const subgraphController = require('../controller/Subgraph')
// const { jsonParser } = require('../utils/postSetting')
const multer = require('multer')
const subgraphModel = require('../model/Subgraph')
const { queryGetSQL} = require('../../config/connection')

const fileStorageEng = multer.diskStorage({
    destination: (req, file, cb) => {
       cb(null, "./public/subgraph"); 
    },
    filename: (req, file, cb) => {
          if(req.params.id){
            cb(null, Number(req.params.id)+'.png');
          }else{
            let subgraphSql = subgraphModel.getSubgraphCount()
            queryGetSQL(subgraphSql, async (err, data) => { 
                if (err) return next(err);
                var sumCount =data.sumCount;
                cb(null, Number(sumCount)+1+'.png');
           })
          }
    },
});
const uploadImage = multer({ storage: fileStorageEng });

router.get('/', subgraphController.getSubgraph)
router.get('/:id', subgraphController.getSubgraphById)
router.post('/', uploadImage.fields([
    { name: 'image'}
  ]), subgraphController.addSubgraph)
router.put('/:id', uploadImage.fields([
    { name: 'image'}
  ]), subgraphController.updateSubgraph)
router.delete('/:id',subgraphController.deleteSubgraph)

module.exports = router


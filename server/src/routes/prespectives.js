const express = require('express')
const router = express.Router()
const prespectivesController = require('../controller/Prespectives')
// const { jsonParser, urlencodedParser } = require('../utils/postSetting')

const multer = require('multer')
const prespectivesModel = require('../model/Prespectives')
const { queryGetSQL} = require('../../config/connection')

const fileStorageEng = multer.diskStorage({
  destination: (req, file, cb) => {
     cb(null, "./public/img"); 
  },
  filename: (req, file, cb) => {
        if(req.params.id){
          cb(null, Number(req.params.id)+'.png');
        }else{
          let prespectivesSql = prespectivesModel.getPrespectivesCount()
          queryGetSQL(prespectivesSql, async (err, data) => { 
              if (err) return next(err);
              var sumCount =data.sumCount;
              cb(null, Number(sumCount)+1+'.png');
         })
        }
  },
});

const uploadImage = multer({ storage: fileStorageEng });

router.get('/', prespectivesController.getPrespectives)
router.get('/:id', prespectivesController.getPrespectivesById)
router.post('/', uploadImage.fields([
    { name: 'image'}
  ]), prespectivesController.addPrespectives)
router.put('/:id', uploadImage.fields([
    { name: 'image'}
  ]), prespectivesController.updatePrespectives)
router.delete('/:id',prespectivesController.deletePrespectives)

module.exports = router


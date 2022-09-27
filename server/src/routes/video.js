const express = require('express')
const router = express.Router()
const videoController = require('../controller/Video')
const multer = require('multer')
const videoModel = require('../model/Video')
const { queryGetSQL} = require('../../config/connection')

const fileStorageEng = multer.diskStorage({
    destination: (req, file, cb) => {
      var reg = RegExp(/video/);
      if(file.mimetype.toString().match(reg)){
        cb(null, "./public/course/video/source"); 
      }else{
        cb(null, "./public/course/video/image"); 
      }
    },
    filename: (req, file, cb) => {
      if(req.params.id){
        var reg = RegExp(/video/);
        if(file.mimetype.toString().match(reg)){
           cb(null, Number(req.params.id)+'.' +file.mimetype.split("/")[1]);
        }else{
           cb(null, Number(req.params.id)+'.png');
        }
      }else{
        let courseVideoSql = videoModel.getCourseVideoCount()
        queryGetSQL(courseVideoSql, async (err, data) => { 
            if (err) return next(err);
            var sumCount =data.sumCount;
            var reg = RegExp(/video/);
            if(file.mimetype.toString().match(reg)){
               cb(null, Number(sumCount)+1+'.' +file.mimetype.split("/")[1]);
            }else{
               cb(null, Number(sumCount)+1+'.png');
            }
       })
      }
    },
});
const uploadImage = multer({ storage: fileStorageEng });

router.get('/', videoController.getAllCourseVideo)
router.get('/:id', videoController.getCourseVideoById)
router.post('/', uploadImage.fields([
    { name: 'cover'},
    { name: 'video'}
  ]), videoController.addCourseVideo)
router.put('/:id', uploadImage.fields([
    { name: 'cover'},
    { name: 'video'}
  ]), videoController.updateCourseVideo)

module.exports = router


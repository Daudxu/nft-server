const express = require('express')
const router = express.Router()
const courseController = require('../controller/Course')
const multer = require('multer')
const courseModel = require('../model/Course')
const { queryGetSQL} = require('../../config/connection')

const fileStorageEng = multer.diskStorage({
    destination: (req, file, cb) => {
       cb(null, "./public/course/images"); 
    },
    filename: (req, file, cb) => {
          if(req.params.id){
            cb(null, Number(req.params.id)+'.png');
          }else{
            let courseSql = courseModel.getCourseCount()
            queryGetSQL(courseSql, async (err, data) => { 
                if (err) return next(err);
                var sumCount =data.sumCount;
                cb(null, Number(sumCount)+1+'.png');
           })
          }
    },
});
const uploadImage = multer({ storage: fileStorageEng });

router.get('/', courseController.getCourse)
router.get('/:id', courseController.getCourseById)
router.get('/courseVideoList/:id', courseController.courseVideoList)
router.get('/video/:id', courseController.getCourseVideoById)
router.post('/', uploadImage.fields([
    { name: 'cover'}
  ]), courseController.addCourse)
router.put('/:id', uploadImage.fields([
    { name: 'cover'}
  ]), courseController.updateCourse)

module.exports = router


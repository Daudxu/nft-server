const courseModel = require('../model/Course')
const videoModel = require('../model/Video')
const { queryAllSQL, queryGetSQL, queryRunSQL, dataFormat } = require('../../config/connection');
const Token = require('../utils/token')
const fs = require('fs'); 
const path = require('path');

const MetadataHex = require('../utils/metadataHex')
const site = "https://knowledge.serenity-research.com"  

module.exports = {
  getCourse: async (req, res, next) => {
    let sql = courseModel.getAllCourse(req.body)
      queryAllSQL(sql, (err, data) => { 
        if (err) return next(err);
        res.json(dataFormat(data, 200))
     })
  },
  getCourseById: async (req, res, next) => {
    if(req.params.id){
      let CourseSql = courseModel.getCourseById(req.params.id)
      queryGetSQL(CourseSql, async (err, data) => { 
        if (err) return next(err);
        res.json(dataFormat(data, 200))
      })
    }else{
      res.json(dataFormat([], 201))
    }
  },
  addCourse: async (req, res, next) => {
    let tokenData = Token.decrypt(req.get('authorization')); 
    if (tokenData.token) {
        if(req.body.title && req.body.description && req.body.price && req.files.cover){
          let courseCountSql = courseModel.getCourseCount()
          queryGetSQL(courseCountSql, async (err, data) => { 
            if (err) return next(err);
            var sumCount = data.sumCount
            var courseId = Number(sumCount)+1
            var metadata = {
              "name": req.body.name,
              "description": req.body.description, 
              "external_url": "",
              "image": site+"/course/images/"+courseId+".png",
              "tokenId" : courseId,
              "attributes": [
                  {
                    "trait_type": " Course type", 
                    "value": "Video Course"
                  }
              ]
            }
            var metadataJson = JSON.stringify(metadata); 
            var hexTokenId = MetadataHex.getMetadataHex(courseId);
            fs.writeFile("./public/course/metadata/"+hexTokenId+".json", metadataJson, 'utf8', function (err) { 
              if (err) { 
                  console.log("An error occured while writing JSON Object to File."); 
                  return console.log(err); 
              }
            });
            var dateTime = Math.floor(Date.now() / 1000)
            var parmas = {
              title: req.body.title,
              description: req.body.description,
              content: req.body.content,
              price: req.body.price,
              cover: site+"/course/images/"+courseId+".png",
              metadata: site+"/course/metadata/"+hexTokenId+".json",
              create_date: dateTime,
              update_date: dateTime,
            }
            let CourseSql = courseModel.addCourse(parmas)
            queryRunSQL(CourseSql, async (err, data) => { 
                if (err) return next(err);
                res.json(dataFormat(data, 200))
            })
          })
 
        }else{
          res.json(dataFormat([], 201))
        }
    }else{
      res.json(dataFormat([], 203))
    }
  },
  updateCourse: async (req, res, next) => {
    let tokenData = Token.decrypt(req.get('authorization')); 
    if (tokenData.token) {
        var parmas = ""
        var dateTime = Math.floor(Date.now() / 1000)
        var courseId = Number(req.params.id)
        var metadata = {
          "name": req.body.name,
          "description": req.body.description, 
          "external_url": "",
          "image": site+"/course/images/"+courseId+".png",
          "tokenId" : courseId,
          "attributes": [
              {
                "trait_type": " Course type", 
                "value": "Video Course"
              }
          ]
        }
        var metadataJson = JSON.stringify(metadata); 
        var hexTokenId = MetadataHex.getMetadataHex(courseId);
        if( req.params.id && req.body.title && req.body.description && req.body.price && req.files.cover){
            parmas = {
              title: req.body.title,
              description: req.body.description,
              content: req.body.content,
              price: req.body.price,
              cover: site+"/course/images/"+courseId+".png",
              metadata: site+"/course/metadata/"+hexTokenId+".json",
              update_date: dateTime,
            }
            let CourseSql = courseModel.updateCourse(parmas, req.params.id)
            queryRunSQL(CourseSql, async (err, data) => { 
                if (err) return next(err);
                res.json(dataFormat(data, 200))
            })
        }else if(req.params.id && req.body.title && req.body.description && req.body.price){
          parmas = {
            title: req.body.title,
            description: req.body.description,
            content: req.body.content,
            price: req.body.price,
            metadata: site+"/course/metadata/"+hexTokenId+".json",
            update_date: dateTime,
          }
          let CourseSql = courseModel.updateCourse(parmas, req.params.id)
          queryRunSQL(CourseSql, async (err, data) => { 
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
  courseVideoList: async (req, res, next) => {
    if(req.params.id){
      let sql = videoModel.getCourseVideoLListById(req.params.id)
      queryAllSQL(sql, (err, data) => { 
        if (err) return next(err);
        
        res.json(dataFormat(data, 200))
     })
    }else{
      res.json(dataFormat([], 404))
    }
  },
  getCourseVideoById: async (req, res, next) => {
    var sourcePath = path.join(__dirname,'../../')+"public/course/video/source/";
    if(req.params.id){
      const range = req.headers.range;
      if (!range) {
          res.status(400).send("Requires Range header");
      }else{
        const videoPath = sourcePath+"1.mp4";
        const videoSize = fs.statSync(videoPath).size;
        const CHUNK_SIZE = 10 ** 6;
        const start = Number(range.replace(/\D/g, ""));
        const end = Math.min(start + CHUNK_SIZE, videoSize - 1);
        const contentLength = end - start + 1;
        const headers = {
            "Content-Range": `bytes ${start}-${end}/${videoSize}`,
            "Accept-Ranges": "bytes",
            "Content-Length": contentLength,
            "Content-Type": "video/mp4",
        };
        res.writeHead(206, headers);
        const videoStream = fs.createReadStream(videoPath, { start, end });
        videoStream.pipe(res);
      }
     
    }else{
      res.json(dataFormat([], 404))
    }
  }
}
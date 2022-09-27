// API
const express = require('express')
const compression = require('compression')

// Import modules
// const redisConnection = require('./src/utils/redis/redisConnection')
// const swaggerDoc = require('./swagger/swaggerDoc')
// const jwtAuth = require('./src/utils/jwt')
const Routers = require('./src/routes/index')
const logRecode = require('./log/index')

// Init
const app = express()

app.use(compression())


// log
app.use(logRecode)
app.use(express.static(__dirname + '/public'))

// 允许跨域
app.all('*', function(req, res, next) {
  // console.log(req.headers.origin)
  // console.log(req.environ)
//   res.header("Access-Control-Allow-Origin", req.headers.origin);
  var origin = req.headers.origin;
  // console.log(origin)
if (typeof(origin) === 'undefined') {
    res.header('Access-Control-Allow-Origin', '*'); 
} else {
    res.header("Access-Control-Allow-Origin", req.headers.origin);
}

//   res.header('Access-Control-Allow-Origin', '*'); 
//   res.header("Access-Control-Allow-Origin", '*');
  res.header("Access-Control-Allow-Headers", '*');
  res.header("Access-Control-Allow-Method", '*');
  res.header("Access-Control-Allow-Credentials", 'true');
  
//   res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With");
//   res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
  res.header("Access-Control-Allow-Credentials","true");
  res.header("X-Powered-By",' 3.2.1')
  if(req.method === "OPTIONS") res.send(200);/*让options请求快速返回*/
  else  next();
});


// JWT
// app.use(jwtAuth)
// app.use(function (err, req, res, next) {
//   if (err.name === 'UnauthorizedError') {
//     res.status(401).send(err.message);
//   }
// });

Routers(app)
const port = 8002
app.listen(port, function (){
  console.log('Example app listening on port'+port+'!');
  console.log(`Your application is running here: http://localhost:${port}`)
});

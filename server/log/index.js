const path = require('path')
const fs = require('fs')

const morgan = require('morgan')
const FileStreamRotator = require('file-stream-rotator')

const logDirectory = path.join(__dirname, 'logs')

// --Start-- 
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory)
let accessLogStream = FileStreamRotator.getStream({
  date_format: 'YYYYMMDDYYYY',
  filename: path.join(logDirectory, 'access-%DATE%.log'),
  frequency: 'daily',
  verbose: false
})
// --END--

module.exports = morgan('combined', {stream: accessLogStream})
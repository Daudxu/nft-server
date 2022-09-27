const express = require('express')
const router = express.Router()

const { jsonParser, urlencodedParser } = require('../utils/postSetting')
const user = require('../controller/User')

router.post('/', jsonParser, user.login);

module.exports = router


const express = require('express')
const router = express.Router()
const aoiController = require('../controller/Api')
// const { jsonParser } = require('../utils/postSetting')


router.get('/:apikey', aoiController.getSubgraphByApikey)

module.exports = router


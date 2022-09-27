

const path = require('path');
const sqlite3 = require('sqlite3');
var db = new sqlite3.Database( path.resolve(__dirname, '../../database/nft.db') );

module.exports = {
  getAllAsssets: () => {
    return `select token_id, name, description, content, image, metadata_path, date from nftAssets order by token_id desc`
  },
  getAsssetsById: (tokenId) => {
    return `SELECT token_id, name, description, content, image, metadata_path, date FROM nftAssets WHERE token_id = ${tokenId}`
  },
  getAssetsCount: () => {
    return `select count(token_id) as sumCount from nftAssets`
  },
  addAssets: (parmas) => {
    try {
        let filter = ''
        let val = ''
        var keys = Object.keys(parmas)
        var values = Object.values(parmas)
        keys.forEach( (e, i) => {
          let point = (i+1) !== keys.length ? ',' : ''
          filter += `'${e}' ${point}`
          val += `'${values[i]}' ${point}`
        })
        return `INSERT INTO nftAssets (  ${filter} ) VALUES ( ${val} ) `
    } catch (e) {
      console.log(e)
    }
  },
  updateAssets: (parmas, id) => {
      let filter = ''
      var keys = Object.keys(parmas)
      var values = Object.values(parmas)
      keys.forEach( (e, i) => {
        let point = (i+1) !== keys.length ? ',' : ''
        filter += `'${e}'='${values[i]}'${point}`
      })
      return `UPDATE nftAssets
              SET ${filter} 
              WHERE token_id=${id} ;`
  }
}



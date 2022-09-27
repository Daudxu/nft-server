const Web3 = require('web3')
const MetadataHex = {
   getMetadataHex:function(tokenId){ 
    var tokenIdHex = Web3.utils.toHex(tokenId).replace('0x', '')
    var initNumber = "0000000000000000000000000000000000000000000000000000000000000000"
    var initNumberLength = initNumber.length
    var tokenIdHexLength = tokenIdHex.length
    var startCoordinate = initNumberLength-tokenIdHexLength
    var startIndex = startCoordinate
    var endIndex = 64
    if (endIndex < startIndex) {
      startIndex = endIndex;
    }
    var a = initNumber.substring(0, startIndex);
    var b = initNumber.substring(endIndex);
    return (a + b + tokenIdHex)
  }, 
}
module.exports = MetadataHex;
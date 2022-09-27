module.exports = {
  getAllPrespectives: () => {
    return `select id, title, description, image, url, sort, date from prespectives order by sort desc, id desc`
  },
  getPrespectivesById: (id) => {
    return `SELECT id, title, description, image, url, sort, date FROM prespectives WHERE id = ${id}`
  },
  getPrespectivesCount: () => {
    return `select count(id) as sumCount from prespectives`
  },
  addPrespectives: (parmas) => {
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
        return `INSERT INTO prespectives (  ${filter} ) VALUES ( ${val} ) `
    } catch (e) {
      console.log(e)
    }
  },
  updatePrespectives: (parmas, id) => {
      let filter = ''
      var keys = Object.keys(parmas)
      var values = Object.values(parmas)
      keys.forEach( (e, i) => {
        let point = (i+1) !== keys.length ? ',' : ''
        filter += `'${e}'='${values[i]}'${point}`
      })
      return `UPDATE prespectives
              SET ${filter} 
              WHERE id=${id} ;`
  },
  delPrespectives: (id) => {
    return `DELETE FROM prespectives where id='${id}' `
  }
}



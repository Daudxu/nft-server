module.exports = {
  getAllCourse: () => {
    return `select * from course order by id desc`
  },
  getCourseById: (id) => {
    return `SELECT * FROM course WHERE id = ${id}`
  },
  getCourseCount: () => {
    return `select count(id) as sumCount from course`
  },
  addCourse: (parmas) => {
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
        return `INSERT INTO course (  ${filter} ) VALUES ( ${val} ) `
    } catch (e) {
      console.log(e)
    }
  },
  updateCourse: (parmas, id) => {
      let filter = ''
      var keys = Object.keys(parmas)
      var values = Object.values(parmas)
      keys.forEach( (e, i) => {
        let point = (i+1) !== keys.length ? ',' : ''
        filter += `'${e}'='${values[i]}'${point}`
      })
      return `UPDATE course
              SET ${filter} 
              WHERE id=${id} ;`
  },
  delCourse: (id) => {
    return `DELETE FROM course where id='${id}' `
  }
}



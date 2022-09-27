module.exports = {
  getAllCourseVideo: (id) => {
    return `SELECT * FROM video `
  },
  getCourseVideoById: (id) => {
    return `SELECT * FROM video WHERE id = '${id}' `
  },
  getCourseVideoCount: () => {
    return `select count(id) as sumCount from video`
  },
  addCourseVideo: (parmas) => {
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
        return `INSERT INTO video (  ${filter} ) VALUES ( ${val} ) `
    } catch (e) {
      console.log(e)
    }
  },
  updateCourseVideo: (parmas, id) => {
      let filter = ''
      var keys = Object.keys(parmas)
      var values = Object.values(parmas)
      keys.forEach( (e, i) => {
        let point = (i+1) !== keys.length ? ',' : ''
        filter += `'${e}'='${values[i]}'${point}`
      })
      return `UPDATE video
              SET ${filter} 
              WHERE id=${id} ;`
  },
  delCourseVideo: (id) => {
    return `DELETE FROM video where id='${id}'`
  },
  getCourseVideoLListById: (course_id) => {
    return `SELECT * FROM video WHERE course_id='${course_id}' order by id desc`
  },
}



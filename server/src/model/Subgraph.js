module.exports = {
    getAllSubgraph: () => {
      return `select * from subgraph_api order by id desc`
    },
    getSubgraphById: (id) => {
      return `SELECT * FROM subgraph_api WHERE id = ${id}`
    },
    getSubgraphByApikey: (apikey) => {
      return `SELECT apiurl, apisql FROM subgraph_api WHERE apikey = '${apikey}' `
    },
    getSubgraphCount: () => {
      return `select count(id) as sumCount from subgraph_api`
    },
    addSubgraph: (parmas) => {
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
          return `INSERT INTO subgraph_api (  ${filter} ) VALUES ( ${val} ) `
      } catch (e) {
        console.log(e)
      }
    },
    updateSubgraph: (parmas, id) => {
        let filter = ''
        var keys = Object.keys(parmas)
        var values = Object.values(parmas)
        keys.forEach( (e, i) => {
          let point = (i+1) !== keys.length ? ',' : ''
          filter += `'${e}'='${values[i]}'${point}`
        })
        return `UPDATE subgraph_api
                SET ${filter} 
                WHERE id=${id} ;`
    },
    delSubgraph: (id) => {
      return `DELETE FROM subgraph_api where id='${id}' `
    }
  }
  
  
  
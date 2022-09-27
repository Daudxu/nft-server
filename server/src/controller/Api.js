const subgraphModel = require('../model/Subgraph')
const { queryGetSQL, dataFormat } = require('../../config/connection');
const ApolloBoost = require('apollo-boost');  
const fetch = require('node-fetch');   
const { createHttpLink } = require('apollo-link-http'); 
const {ApolloClient, InMemoryCache} = ApolloBoost 
const gql = require("graphql-tag");

const connectApolloApi = (url) => {
  return  new ApolloClient({
    link: createHttpLink({
      uri: url,
      fetch: fetch,
    }),
    cache: new InMemoryCache(),
  })
}

const  curveFinanceApi = async (url, sql) => {
  return connectApolloApi(url).query({
      query: gql`
        ${sql}
      `,
    })
}

module.exports = {
  getSubgraphByApikey: async (req, res, next) => {
    if(req.params.apikey){
      let SubgraphSql = subgraphModel.getSubgraphByApikey(req.params.apikey)
      queryGetSQL(SubgraphSql, async (err, data) => { 
        if (err) return next(console.log("err", err));
        if(typeof(data) !== "undefined" ){
          await curveFinanceApi(data.apiurl, data.apisql).then((resThegraph)=>{
            res.json(dataFormat(resThegraph.data))
          }).catch((err)=>{
            res.json({code:400, message: 'error: '+err,data:[]})
          })
        }else{
          res.json({code:201, message: 'Incomplete parameters',data:[]})
        }
      })
    }else{
      res.json(dataFormat([], 201))
    }
  }
}
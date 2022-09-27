module.exports = {
  getUser: (name, password) => {
    return `SELECT * FROM admin WHERE name = '${name}' AND password = '${password}'`
  }
}
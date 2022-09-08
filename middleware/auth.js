const key = require("../keys/index")
const jwt = require("jsonwebtoken")

function auth(req, res, next) {
  try {
    let token = req.headers["authorization"]
    if (!token) {
      res.status(401).send("Отсутствует токен")
    }
    token = token.replace('Bearer ', '')

    jwt.verify(token, key.JWT_SECRET, function (err, decoded) {
      if (err) {
        return res.status(401).json({
          success: false,
          message: "выполните вход",
        })
      } else {
        req.userAuth = decoded

        next()
      }
    })
  } catch (e) {
    console.log(e)
  }
}

module.exports = auth

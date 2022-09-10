const jwt = require("jsonwebtoken")
const keys = require("../../../keys/index")

const expire = keys.JWT_EXPIRE


const jwtToken = {
  
  generate(user) {
    const u = {
      name: user.nickname,
      email: user.email,
      id: user.id,
    }
     const token = jwt.sign(u, keys.JWT_SECRET, {
      expiresIn:expire
    })
    return {token,expire}
  },
}

module.exports = jwtToken

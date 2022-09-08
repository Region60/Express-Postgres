const vl = require("validator")
const db = require("../public/javascripts/services/dbServices")

function ifIncludes(str, count, value) {
  const res = str.split("").filter(function (l) {
    return ~value.indexOf(l)
  })
  return res.length >= count ? false : true
}

async function validator(req, res, next) {
  const { email, password, nickname,name } = req.body
  if (email) {
    const response = await db.findOne((table = "users"), "email", email)
    if (response) {
      return res.status(401).send("Пользователь с таким email уже существует")
    }
    if (!vl.isEmail(email)) {
      return res.status(401).send("Не корректный электронный адрес")
    }
  }
  if (password) {
    if (ifIncludes(password, 1, "ABCDEFGJKLMNOPQRSTUVWXYZ")) {
      return res
        .status(401)
        .send("Пароль должен содержать хотябы одну заглавную букву")
    }
    if (ifIncludes(password, 1, "abcdefgjklmnopqrstuvwxvz")) {
      return res
        .status(401)
        .send("Пароль должен содержать хотябы одну строчную букву")
    }
    if (ifIncludes(password, 1, "0123456789")) {
      return res.status(401).send("Пароль должен содержать хотябы одну цифру")
    }
    if (password.length <= 8) {
      return res.status(401).send("Минимальная длинна пароля 8 символов")
    }
  }
  if (nickname){
    const response = await db.findOne((table = "users"), "nickname", nickname)
        if (response) {

         return res.status(401).send("Пользователь с таким nickName уже существует")
        }
  }
  if(name) {
    if (name.length >= 20) {
      return res.status(401).send("Максимальная длинна тега 20 символов")
    }
  }
  next()
}

module.exports = validator

const db = require("./dbServices")
const { v4: uuidv4 } = require("uuid")
var bcrypt = require("bcryptjs")
const jwtToken = require("./jwtServices")

const user = {
  async findOne(idUser) {
    const response = await db.findUserWithTags(idUser)
    if (response) {
      const userWithTagResponse = {
        email: response[0].email,
        nickname: response[0].nickname,
        tags: response.map((i) => ({
          id: i.id,
          name: i.name,
          sortOrder: i.sortorder,
        })),
      }
      return { code: 200, payload: userWithTagResponse }
    } else {
      return { code: 404, message: "Пользователь не найден" }
    }
  },

  async create(userData) {
    const { email, password, nickname } = userData
    const candidate = await db.findOne((table = "users"), "email", email)
    if (candidate) {
      return { code: 400, message: "Такой пользователь уже существует" }
    } else {
      const hashPassword = await bcrypt.hash(password, 10)
      const id = uuidv4()
      await db.createUser({
        table: "users",
        id,
        email,
        password: hashPassword,
        nickname,
      })
      const { expire, token } = await jwtToken.generate({ id, email, nickname })
      return { code: 201, payload: { token, expire } }
    }
  },

  async login(loginDate) {
    const { email, password } = loginDate
    const candidate = await db.findOne((table = "users"), "email", email)
    if (!candidate) {
      return { code: 401, message: "Неправильный email или пароль" }
    } else {
      return bcrypt
        .compare(password, candidate.password)
        .then(async function (valid) {
          if (valid) {
            const { id, email, nickname } = candidate
            const { expire, token } = await jwtToken.generate({
              id,
              email,
              nickname,
            })
            return { code: 201, payload: { token, expire } }
          }
          return { code: 401, message: "Неправильный email или пароль" }
        })
    }
  },

  async delete(id) {
    const candidate = await db.findOne((table = "users"), "id", id)
    if (!candidate) {
      return { code: 404, message: "Пользователь не найден" }
    } else {
      db.delete((table = "users"), id)
      return { code: 200, message: "Пользователь удален" }
    }
  },

  async update(userNewData) {
    const candidate = await db.findOne((table = "users"), "id", userNewData.id)
    if (!candidate) {
      return { code: 404, message: "Пользователь не найден" }
    } else {
      const hashPassword = await bcrypt.hash(userNewData.password, 10)
      userNewData.password = hashPassword
      await db.updateUser(userNewData)
      const { email, nickname } = await db.findOne(
        (table = "users"),
        "id",
        userNewData.id
      )
      return { code: 200, payload: { email, nickname } }
    }
  },

  async addTags(idUser, tags) {
    const containsTag = await db.contentCheck(tags)
    console.log(containsTag)
    console.log(tags)
    if (containsTag.length === tags.length) {
      await db.addTagsForUser(idUser, tags)

      return { code: 200, payload: containsTag }
    } else {
      return { code: 404, message: `Неверные id тегов!` }
    }
  },

  async deleteUserTag(idUser, idTag) {
    await db.deleteUserTag(idUser, idTag)
    const response = await db.getUeserTag(idUser)
    if (response) {
      return { code: 200, payload: { tags: response.rows } }
    } else {
      return { code: 404, message: `Пользователь с id ${idUser} не найден!` }
    }
  },

  async getUeserTag(idUser) {
    const response = await db.getUeserTag(idUser)
    if (response) {
      return { code: 200, payload: { tags: response.rows } }
    } else {
      return { code: 404, message: `Пользователь с id ${idUser} не найден` }
    }
  },
}

module.exports = user

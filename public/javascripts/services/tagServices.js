const db = require("./dbServices")
const { v4: uuidv4 } = require("uuid")

const tag = {
  async findOne(idTag) {
    const response = await db.findOne((table = "tag"), "id", idTag)
    if (response.length) {
      return { code: 200, payload: response }
    } else {
      return { code: 404, message: "Тэг не найден" }
    }
  },

  async findOneTag(idTag) {
    const response = await db.findOneTag(idTag)
    const payload = {
      creator: { nickname: response.nickname, uid: response.id },
      name: response.name,
      sortOrder: response.sortorder,
    }
    if (response) {
      return { code: 201, payload }
    } else {
      return { code: 404, message: "Тэг не найден" }
    }
  },

  async findMany(queryParams) {
    const { sortByOrder, sortByName, page, pageSize } = queryParams
    const sorterBy = sortByOrder ? "sortorder" : sortByName ? "name" : null
    const response = await db.findManyTag(sorterBy, page, pageSize)
    if (response) {
      const arrResult = response.map((i) => ({
        creator: { nickname: i.nickname, uid: i.id },
        name: i.name,
        sortOrder: i.sortorder,
      }))
      const payload = {
        data: arrResult,
        meta: { page, pageSize, quantity: response.rowCount },
      }
      return { code: 201, payload }
    } else {
      return { code: 404, message: "Тэгов не найдено" }
    }
  },

  async create(tagData) {
    const { name, idCreator } = tagData

    const candidate = await db.findOne((table = "tag"), "name", name)
    if (candidate) {
      return { code: 400, message: "Такой Тэг уже уществует" }
    } else {
      await db.createTag({
        table: "tag",
        name,
        idCreator,
      })
      const response  = await db.findOne(
        (table = "tag"),
        "name",
        name
      )
      return { code: 201, payload: response }
    }
  },

  async update(idTag, text, userId) {
    const tag = await db.findOne((table = "tag"), "id", idTag)
    if (tag.creator === userId) {
      await db.updateTag(idTag, text)
      return (response = await this.findOneTag(idTag))
    } else {
      return { code: 404, message: "Только автор может редактировать тег" }
    }
  },

  async delete(idTag, userId) {
    const tag = await db.findOne((table = "tag"), "id", idTag)
    if (tag.creator === userId) {
     await db.delete((table = "tag"), idTag)
     return { code: 200, message: "Тег удален" }
    } else {
      return { code: 404, message: "Только автор может удалить тег" }
    }
  },
}

module.exports = tag

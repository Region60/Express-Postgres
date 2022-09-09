const { Pool } = require("pg")

const pool = new Pool({
  connectionString: process.env.DATABASE_URL ,
ssl:{
  rejectUnauthorized:false
}
})


const tablesData = [
  {
    name: "users",
    queryString:
      "CREATE TABLE users (Id UUID PRIMARY KEY, email VARCHAR(100) UNIQUE, password VARCHAR(100), nickname VARCHAR(30) UNIQUE)",
  },
  {
    name: "tag",
    queryString:
      "CREATE TABLE tag (Id SERIAL PRIMARY KEY , creator UUID, name VARCHAR(40) UNIQUE, sortOrder INT DEFAULT 0, FOREIGN KEY (creator) REFERENCES users (Id) ON DELETE CASCADE)",
  },
  {
    name: "usertag",
    queryString:
      "CREATE TABLE userTag (users UUID REFERENCES users(Id) ON DELETE CASCADE, tagId INT REFERENCES tag(Id) ON DELETE CASCADE)",
  },
]

const db = {
  async getAllTables() {
    const result = await pool
      .query(
        "SELECT table_name FROM information_schema.tables WHERE table_schema NOT IN ('information_schema','pg_catalog');"
      )
      .then((res) => res)
      .catch((e) => console.error(e.stack))
      if (result.rows){
        return result.rows
      }else{
        console.log("В базе данных нет таблиц")
      }

  },

    async createTables(index) {
      let i = index
      if(!(index === tablesData.length)){
      const tables = await this.getAllTables()
      if (!tables.find((t) => t.table_name === tablesData[i].name)) {
        const result = await pool
          .query(tablesData[i].queryString)
          .then((res) => {
            console.log(`таблица ${tablesData[i].name} создана`)
            return res
          })
        .catch((e) => console.error(e.stack))
    }
    i+= 1
    this.createTables(i)
  }

  },

  async findOne(table, column, value) {
    const result = await pool
      .query(`SELECT * FROM ${table} WHERE ${column} = '${value}'`)
      .then((res) => res)
      .catch((e) => console.error(e.stack))
    return result.rows[0]||null
  },

  async findUserWithTags (id){
    const result = await pool
    .query(`SELECT * FROM users  JOIN tag ON users.id = tag.creator and tag.creator = '${id}' `)
      .then((res) => res)
      .catch((e) => console.error(e.stack))
      console.log(result.rows)
    return result.rows||null
  },
  

  delete(table, id) {
    pool.query(`DELETE FROM ${table} WHERE id='${id}'`)
  },

  async createUser(userData) {
    const result = await pool
      .query(
        `INSERT INTO ${userData.table} (nickname,id,password,email)VALUES('${userData.nickname}','${userData.id}','${userData.password}','${userData.email}')`
      )
      .then((res) => res)
      .catch((e) => console.error(e.stack))
    return result.rows
  },

  async updateUser(newUserData) {
    const { password, nickname, id, email } = newUserData
    const result = await pool
      .query(
        `UPDATE users SET email = '${email}', nickname = '${nickname}', password = '${password}' WHERE id = '${id}'`
      )
      .then((res) => res)
      .catch((e) => console.error(e.stack))
    return result.rows
  },

  async createTag(tagData) {
    const result = await pool
      .query(
        `INSERT INTO ${tagData.table} (name, creator)VALUES('${tagData.name}','${tagData.idCreator}')`
      )
      .then((res) => res)
      .catch((e) => console.error(e.stack))
    return result.rows
  },

  async findOneTag(id) {
    const result = await pool
      .query(
        `SELECT tag.name, tag.sortOrder, users.nickname, users.id FROM tag, users WHERE tag.id = '${id}' AND tag.creator=users.id;`
      )
      .then((res) => res)
      .catch((e) => console.error(e.stack))
    return result.rows[0]||null
  },

  async findManyTag(sortBy, page, pageSize) {
    const sorter = sortBy === null ? "" : `ORDER BY ${sortBy}`
    const paginator =
      page || pageSize
        ? `LIMIT ${pageSize} OFFSET ${pageSize * page - page}`
        : ""
    const result = await pool
      .query(
        `SELECT tag.name, tag.sortOrder, users.nickname, users.id FROM tag, users WHERE tag.creator=users.id ${sorter} ${paginator};`
      )
      .then((res) => res)
      .catch((e) => console.error(e.stack))
      return result.rows||null
  },

  async updateTag(idTag, text) {
    const result = await pool
      .query(`UPDATE tag SET name = '${text}' WHERE id = '${idTag}'`)
      .then((res) => res)
      .catch((e) => console.error(e.stack))
    return result.rows[0]
  },

  async contentCheck(array) {
    const result = await pool
      .query(`select * from tag where id in (${array.join(",")});  `)
      .then((res) => res)
      .catch((e) => console.error(e.stack))
    return result.rows
  },

  async addTagsForUser(idUser, idTags) {
    const arrConvertedToString = idTags
      .map((i) => `('${idUser}', ${i})`)
      .join(",")
    const result = await pool
      .query(
        `INSERT INTO userTag (users, tagId) VALUES ${arrConvertedToString}`
      )
      .then((res) => res)
      .catch((e) => console.error(e.stack))
    return result.rows
  },

  async deleteUserTag(idUser, idTag) {
    const result = await pool
      .query(
        `DELETE FROM usertag WHERE users='${idUser}' AND tagid = '${idTag}'`
      )
      .then((res) => res)
      .catch((e) => console.error(e.stack))
    return result.rows
  },

  async getUeserTag(idUser) {
    const result = await pool
      .query(
        `SELECT  tag.name, tag.id, tag.sortOrder FROM tag, userTag WHERE userTag.users='${idUser}' AND tag.creator = userTag.users;`
      )
      .then((res) => res)
      .catch((e) => console.error(e.stack))
    return result
  },
}

module.exports = db

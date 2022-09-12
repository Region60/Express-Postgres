var express = require("express")
const auth = require("../middleware/auth")
const validator = require("../middleware/validator")
const jwtToken = require("../public/javascripts/services/jwtServices")
const user = require("../public/javascripts/services/userServices")
var router = express.Router()

router.get("/getuser", auth, async (req, res) => {
  try {

    const { code, payload, message } = await user.findOne(req.userAuth.id)
    if (code === 200) {
      const { password, ...withOutPass } = payload
      res.status(code).json(withOutPass)
    } else {
      res.status(code).send(message)
    }
  } catch (error) {
    console.log(error)
  }
})

router.post("/signin", validator, async (req, res) => {
  try {
    const { code, payload, message } = await user.create(req.body)
    if (code === 201) {
      res.status(code).json(payload)
    } else {
      res.status(code).send(message)
    }
  } catch (error) {
    console.log(error)
  }
})

router.post("/login", async (req, res) => {
  try {
    const { code, payload, message } = await user.login(req.body)
    if (code === 201) {
      res.status(code).json(payload)
    } else {
      res.status(code).send(message)
    }
  } catch (error) {
    console.log(error)
  }
})

router.delete("/delete", auth, async (req, res) => {
  try {
    const { code, payload, message } = await user.delete(req.userAuth.id)
    if (code === 200) {
      res.status(code).json(payload)
    } else {
      res.status(code).send(message)
    }
  } catch (error) {
    console.log(error)
  }
})

router.put("/", auth, validator, async (req, res) => {
  try {
    const { id } = req.userAuth
    const userNewData = { id, ...req.body }
    const { code, payload, message } = await user.update(userNewData)
    if (code === 200) {
      res.status(code).json(payload)
    } else {
      res.status(code).send(message)
    }
  } catch (error) {
    console.log(error)
  }
})

router.post("/tag", auth, async (req, res) => {
  try {
    const { code, payload, message } = await user.addTags(
      req.userAuth.id,
      req.body.tags
    )
    if (code === 200) {
      res.status(code).json(payload)
    } else {
      res.status(code).send(message)
    }
  } catch (error) {
    console.log(error)
  }
})

router.delete("/tag/:id", auth, async (req, res) => {
  try {
    const { code, payload, message } = await user.deleteUserTag(
      req.userAuth.id,
      req.params.id
    )
    if (code === 200) {
      res.status(code).json(payload)
    } else {
      res.status(code).send(message)
    }
  } catch (error) {
    console.log(error)
  }
})

router.get("/tag/my", auth, async (req, res) => {
  try {
    try {
      const { code, payload, message } = await user.getUeserTag(req.userAuth.id)
      if (code === 200) {
        res.status(code).json(payload)
      } else {
        res.status(code).send(message)
      }
    } catch (error) {
      console.log(error)
    }
  } catch (error) {
    console.log(err)
  }
})

router.get("/refreshToken", auth, async (req, res) => {
  try {
    const { expire, token } = await jwtToken.generate(req.userAuth)
    res.status(200).json({token,expire})
  } catch (error) {
    console.log(error)
  }
})

module.exports = router

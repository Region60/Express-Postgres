var express = require("express")
const auth = require("../middleware/auth")
const validator = require("../middleware/validator")
const tag = require("../public/javascripts/services/tagServices")
var router = express.Router()

router.post("/",auth,validator, async (req, res) => {
  try {
    const response = await tag.create({ idCreator: req.userAuth.id, ...req.body })
    if (response.code === 201) {
      res.status(response.code).json(response.payload)
    } else {
      res.status(response.code).send(response.message)
    }
  } catch (error) {
    console.log(error)
  }
})

router.get("/:id", auth, async (req, res)=>{
  try {
    const response = await tag.findOneTag(+req.params.id)
    if (response.code === 201) {
      res.status(response.code).json(response.payload)
    } else {
      res.status(response.code).send(response.message)
    }
    
  } catch (error) {
    console.log(error)
  }
})

router.get("/", auth, async (req, res)=>{
  try {
    const response = await tag.findMany(req.query)
    if (response.code === 201) {
      res.status(response.code).json(response.payload)
    } else {
      res.status(response.code).send(response.message)
    }
    
  } catch (error) {
    console.log(error)
  }
})
router.put("/:id",auth, async (req, res)=> {
  try {
    console.log(req.userAuth)
    const response = await tag.update(+req.params.id, req.body.text, req.userAuth.id)
    if (response.code === 201) {
      res.status(response.code).json(response.payload)
    } else {
      res.status(response.code).send(response.message)
    }
  } catch (error) {
    console.log(error)
  }
})


router.delete("/:id",auth, async (req, res) => {
  try {
    const response =await tag.delete(req.params.id, req.userAuth.id)
    if (response.code === 200) {
      res.status(response.code).json(response.message)
    } else {
      res.status(response.code).send(response.message)
    }  } catch (error) {
    console.log(error)
  }
})


module.exports = router

const express = require('express')
const app = express()
const userModel = require('./models/user.model')
const jwt = require('jsonwebtoken')
app.use(express.json())
app.post('/register',async (req,res)=>{
const {email,password} = req.body
 const user =  await userModel.create({
    email,
    password
  })
  const token = jwt.sign({id:user._id},process.env.JWT_SECRET)
  res.cookie('token',token)
  res.json({
    user,
    token
  })
}
)

module.exports = app
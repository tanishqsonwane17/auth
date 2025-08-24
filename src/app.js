const express = require('express')
const app = express()
const userModel = require('./models/user.model')
app.use(express.json())
app.post('/register',async (req,res)=>{
const {email,password} = req.body
 const user =  await userModel.create({
    email,
    password
  })
  res.send(user)
}
)

module.exports = app
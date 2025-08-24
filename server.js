const app = require('./src/app')
const dotenv = require('dotenv')
dotenv.config()
const dbConnection = require('./src/db/db')
dbConnection()
app.listen(3000,()=>{
    console.log('server is listning in port 3000 ')
})
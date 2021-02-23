require('./db/dbConnection') //* to run file
const express = require('express')
const userRouter = require('./routers/user')
const articleRouter = require('./routers/articles')

const app = express()

app.use(express.json())
app.use(userRouter)

port = process.env.PORT

app.listen(port, (req, res) => {
    console.log('Server is running at ' + port);
})
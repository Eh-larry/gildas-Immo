const express = require('express')
const cors = require('cors')
const { connectDB } = require('./config/DBconfig')
const app = express()
require('dotenv').config()
const helmet = require('helmet')
app.use(helmet({
    contentSecurityPolicy : false
}))
app.use(cors())

app.use(express.json())
const userRouter = require('./routes/userRoute')
const PropertyRouter = require('./routes/propertyRoute')
app.use('/uploads', express.static('uploads'))
app.use('/api/user', userRouter)
app.use('/api/property', PropertyRouter)
connectDB()






app.listen(process.env.PORT, () => {
    console.log('server lancé sur le port 4000')
})


// Web Server.js

import express from 'express'
import dotenv from 'dotenv'
dotenv.config()
import cors from 'cors'
import cookieParser from 'cookie-parser'
const PORT = process.env.PORT || 5000

const app = express();

import connectDB from './Database/connectDB.js'
import authRoute from './routes/authRoute.js'
import todoRoute from './routes/todoRoute.js'


app.use(cors({
    origin: 'http://localhost:5173',  // your frontend URL
    credentials: true,                 // 👈 allows sending cookies
}))
app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({ extended: true }))

app.use('/api/auth', authRoute);
app.use('/api/todo', todoRoute)





app.listen(PORT, () => {
    console.log(`Server is running on this port: ${PORT}`)
    connectDB()
})    
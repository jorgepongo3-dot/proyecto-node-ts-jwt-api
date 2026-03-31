import express  from "express";
import authRoutes from './routes/authRouter.js'
import userRoutes from './routes/userRoutes.js'

const app = express()
app.use(express.json())
// console.log('iniciando en la terminal en tiempo real')
//routes
app.use('/auth', authRoutes )
app.use('/user', userRoutes )
//autentication 
//register

export default app;
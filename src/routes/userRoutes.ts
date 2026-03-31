import express  from "express";
import { jwtAutorization } from "../services/authToken.services.js";
import { createUser, getAllUser, getUserId, userDelete, userUpdate } from "../controller/userController.js";
const routes = express.Router()

routes.post('/',jwtAutorization, createUser)
routes.get('/',jwtAutorization, getAllUser)
routes.get('/:id',jwtAutorization, getUserId)
routes.put('/:id',jwtAutorization, userUpdate)
routes.delete('/:id',jwtAutorization, userDelete)

export default routes
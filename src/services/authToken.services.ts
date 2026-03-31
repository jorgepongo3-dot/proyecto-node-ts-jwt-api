import jwt from "jsonwebtoken";
import { User } from "../modules/user.interfaces.js";
import { NextFunction, Response } from "express";
import { autnRequest, jwtPayload } from "../modules/jwt.interfaces.js";

if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET no está definido')
}
const JWT_SECRET: string = process.env.JWT_SECRET

export const generateJWT = (user: User): string=>{
  return jwt.sign({id: user.id, email: user.email}, JWT_SECRET, {expiresIn: '10m'})
}

export const jwtAutorization = (req: autnRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization
  if(!authHeader?.startsWith("Bearer ")){
    res.status(401).json({message: 'No autenticado'})
    return
  }
  const token = authHeader?.split(" ")[1]
  try {
      const decoded = jwt.verify(token, JWT_SECRET) as jwtPayload
      req.user = decoded
      next()
  } catch (error) {
    res.status(401).json({error: 'token invalido'})
  }
}
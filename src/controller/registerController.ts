import { Request, Response } from "express";
import { hashPassword, passwordVerify } from "../services/password.services.js";
import prisma from "../modules/user.prisma.js";
import { generateJWT } from "../services/authToken.services.js";

export const register = async (req: Request, res:Response): Promise<void> =>{
  const {email, password} = req.body
  if(!email || !password){
    res.status(400).json({error: 'Los campos de email y password son obligatorios' })
    return
  }
  try {
    const hashedPassword = await hashPassword(password)
 
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword
      }
    })
    const token = generateJWT(user)
    res.status(201).json({token})
  } catch (error: any) {
    if(error?.code === 'P2002'){
      res.status(409).json({error: `El email ya esta en uso`})
    }
    console.error('Error en el registro:', error)
    res.status(500).json({error: 'hubo un error en el registro'})
  }
}

export const login = async (req: Request, res: Response): Promise<void> => {
  const {email, password} = req.body
  if(!email || !password){
    res.status(400).json({error: 'Los campos de email y password son obligatorios' })
    return
  }
  try {
    const user = await prisma.user.findUnique({where: {email} })
    if(!user){
      res.status(404).json({error: 'usuario no registrado'})
      return
    }
    const passwordMatch = await passwordVerify(password, user.password)
    if(!passwordMatch){
      res.status(400).json({error: 'El ususario o contraseña no coindiden'})
      return
    }
    const token = generateJWT(user)
    res.status(200).json({token})
  } catch (error) {
    res.status(500).json({error: 'error en la peticion intente mas tarde'})
  }
}
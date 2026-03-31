import { Request, Response } from "express";
import { hashPassword } from "../services/password.services.js";
import prisma from "../modules/user.prisma.js";

export const createUser = async (req: Request, res: Response): Promise<void> => {
  const {email, password} = req.body
  if(!email || !password){
    res.status(400).json({error: 'Los campos de email y password son obligatorios'})
  }
  try {
    const hashedPassword = await hashPassword(password)
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword
      }
    })
    res.status(201).json({user})
  } catch (error: any) {
    if(error?.code === 'P2002'){
      res.status(409).json({error: `El email ya esta en uso`})
    }
    res.status(500).json({error: 'hubo un error en el registro'})
  }
}

export const getAllUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const users =  await prisma.user.findMany()
    res.status(200).json(users)
  } catch (error) {
    res.status(500).json({error: 'Hubo un error, pruebe mas tarde'})
  }
}

export const getUserId = async (req: Request<{id: string}>, res: Response): Promise<void> => {
  const idUser = req.params.id
  try {
      const user = await prisma.user.findUnique({
        where: {
          id: idUser
        }
      })
      if(!user){
        res.status(404).json({error: 'usuario no encontrado'})
        return
      }
      res.status(200).json(user)
  } catch (error) {
    res.status(500).json({error: 'Hubo un error, pruebe mas tarde'})
  }
}

export const userUpdate = async (req: Request<{id: string}>, res: Response): Promise<void> => {
  const idUser = req.params.id
  const {email, password} = req.body
  if(!email || !password){
    res.status(400).json({error: 'Los campos email, password deber ser llenados'})
  }
  try {
    let dataToUpdate = { ...req.body }
    if(password){
      const hashedPassword = await hashPassword(password)
      dataToUpdate.password = hashedPassword
    }
    if(email){
      dataToUpdate.email = email
    }
    const user = await prisma.user.update({
      where: {
        id: idUser
      },
      data: dataToUpdate
    })
    res.status(200).json(user)
  } catch (error: any) {
    if(error?.code === "P2002"){
      res.status(400).json({error: 'El email ya existe (duplicado)'})
    }else if(error?.code === "P2025"){
      res.status(404).json({error: 'Resgistro no encontrado'})
    }else{
      res.status(500).json({error: 'Hubo un error, intente mas tarde'})
    }
  }
}

export const userDelete = async (req: Request<{id: string}>, res: Response): Promise<void> => {
  const idUser = req.params.id
  try {
    await prisma.user.delete({
      where: {
        id: idUser
      }
    })
    res.status(200).json({message: `El usuario de id: ${idUser} eliminado exitosamente`}).end()
  } catch (error: any) {
    if(error?.code === "P2025"){
      res.status(404).json({error: 'Resgistro no encontrado'})
    }else{
      res.status(500).json({error: 'Hubo un error, intente mas tarde'})
    }
  }
}
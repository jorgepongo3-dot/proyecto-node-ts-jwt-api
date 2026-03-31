import bcrypt from 'bcrypt'

const salt_round: number = 10
export const hashPassword = async (password: string): Promise<string> =>{
  return await bcrypt.hash(password, salt_round)
}

//verificacion de contraseñas hash con hash

export const passwordVerify = async (password: string, hash: string): Promise<boolean> => {
  return await bcrypt.compare(password,hash)
}
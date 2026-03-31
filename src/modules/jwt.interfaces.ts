import { Request } from "express";

export interface jwtPayload {
  id: string;
  email: string;
}
export interface autnRequest extends Request {
  user?: {
    id: string;
    email: string;
  };
}

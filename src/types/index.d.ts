import { Users } from "@prisma/client"
import * as express from "express"

declare namespace Express {
  export interface Request {
    user?: Users
  }
}

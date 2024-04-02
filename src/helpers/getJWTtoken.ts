import jwt from "jsonwebtoken"
import { config } from "../config/config"

export const getJWTtoken = (id: string) => {
  return jwt.sign({ id }, config.JWT_SECRET, {
    expiresIn: config.JWT_EXPIRY,
  })
}

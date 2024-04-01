import { ApiError } from "../utils/ApiError"
import { db } from "../config/db"
import { StatusCodes } from "http-status-codes"
import bcrypt from "bcryptjs"

export const encryptPassword = async (password: string) => {
  const salt = await bcrypt.genSalt(10)
  return await bcrypt.hash(password, salt)
}

export const comparePassword = async (
  passwword: string,
  userPassword: string
) => {
  return await bcrypt.compare(passwword, userPassword)
}

export const getUserById = async (id: string) => {
  const user = await db.users.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      email: true,
    },
  })
  if (user) {
    return user
  } else {
    throw new ApiError(StatusCodes.NOT_FOUND, "User not found")
  }
}

export const getUserByEmail = async (email: string) => {
  const user = await db.users.findUnique({
    where: {
      email,
    },
    select: {
      id: true,
      email: true,
      password: true,
    },
  })
  if (user) {
    return user
  } else {
    throw new ApiError(StatusCodes.NOT_FOUND, "User not found")
  }
}

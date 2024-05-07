import { Request, Response } from "express"
import { asyncHandler } from "../utils/asyncHandler"
import { StatusCodes } from "http-status-codes"
import { ApiResponse, ApiResponseType } from "../utils/ApiResponse"
import { ApiError, ServerError } from "../utils/ApiError"
import {
  comparePassword,
  encryptPassword,
  getUserByEmail,
} from "../helpers/userFunctions"
import bcrypt from "bcryptjs"
import { db } from "../config/db"
import { Users } from "@prisma/client"
import { getJWTtoken } from "../helpers/getJWTtoken"
import { UserRegisterationType } from "../helpers/validations"

declare global {
  namespace Express {
    export interface Request {
      user?: Users
    }
  }
}

const cookieOptions = {
  httpOnly: true,
}

export const registerUser = asyncHandler(
  async (
    req: Request<{}, {}, UserRegisterationType>,
    res: Response<ApiResponse<Pick<Users, "id" | "email">>>
  ) => {
    const { name, email, password, confirmPassword } = req.body

    if (password !== confirmPassword) {
      throw new ApiError(StatusCodes.BAD_REQUEST, "Password doesnt match")
    }

    const isRegistered = await db.users.findUnique({
      where: {
        email: email,
      },
      select: {
        email: true,
        id: true,
      },
    })

    if (isRegistered) {
      throw new ApiError(StatusCodes.BAD_REQUEST, "Email is already registred")
    }

    const hashedPassword = await encryptPassword(password)

    const user = await db.users.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
      select: {
        id: true,
        email: true,
      },
    })

    res
      .status(StatusCodes.CREATED)
      .json(new ApiResponse("User registed success fully", user))
  }
)

export const loginUser = asyncHandler(
  async (
    req: Request<{}, {}, Pick<Users, "email" | "password">>,
    res: Response<
      ApiResponse<{
        user: Pick<Users, "id" | "email" | "password">
        token: string
      }>
    >
  ) => {
    const { email, password } = req.body
    console.log(req.body)

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
    if (!user) {
      throw new ApiError(StatusCodes.BAD_REQUEST, "User is not registered")
    }

    if (user) {
      const isValid = await bcrypt.compare(password, user.password)

      if (isValid) {
        const token = getJWTtoken(user.id)
        res
          .status(StatusCodes.OK)
          .cookie("token", token, cookieOptions)
          .json(new ApiResponse("Login successful", { user, token }))
      } else {
        throw new ApiError(StatusCodes.BAD_REQUEST, "Invalid credentails")
      }
    } else {
      throw new ApiError(StatusCodes.BAD_REQUEST, "error")
    }
  }
)

export const logout = asyncHandler(
  async (req, res: Response<ApiResponseType<null>>) => {
    res
      .status(StatusCodes.OK)
      .clearCookie("token", cookieOptions)
      .json(new ApiResponse("Successfully logged out"))
  }
)

export const profile = asyncHandler(async (req, res) => {
  if (req.user) {
    const { user } = req
    res.status(StatusCodes.OK).json(new ApiResponse("profile", user))
  }
})

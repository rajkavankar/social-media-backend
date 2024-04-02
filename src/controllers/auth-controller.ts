import { asyncHandler } from "../utils/asyncHandler"
import { StatusCodes } from "http-status-codes"
import { ApiResponse } from "../utils/ApiResponse"
import { ApiError, ServerError } from "../utils/ApiError"
import {
  comparePassword,
  encryptPassword,
  getUserByEmail,
} from "../helpers/userFunctions"
import { db } from "../config/db"
import { getJWTtoken } from "../helpers/getJWTtoken"

export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, confirmPassword } = req.body

  if (password !== confirmPassword) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Password doesnt match")
  }

  const isRegistered = await getUserByEmail(email)
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

  console.log(user)

  res
    .status(StatusCodes.CREATED)
    .json(new ApiResponse("User registed success fully", user))
})

export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body
  const user = await getUserByEmail(email)
  if (!user) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "User is not registered")
  }

  if (user) {
    const isValid = await comparePassword(password, user.password)

    const token = getJWTtoken(user.id)

    if (isValid) {
      res
        .cookie("token", token, {
          httpOnly: true,
          expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        })
        .status(StatusCodes.OK)
        .json(new ApiResponse("Login successful", { user, token }))
    }
  }
})

export const logout = asyncHandler(async (req, res) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  })

  res.status(StatusCodes.OK).json(new ApiResponse("Successfully logged out"))
})

export const profile = asyncHandler(async (req, res) => {
  const { loggedInUser } = req.body

  res.status(StatusCodes.OK).json(new ApiResponse("Profile", loggedInUser))
})

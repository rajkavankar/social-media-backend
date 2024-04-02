import jwt, { type JwtPayload } from "jsonwebtoken"
import { asyncHandler } from "../utils/asyncHandler"
import { ApiError, AuthError } from "../utils/ApiError"
import { config } from "../config/config"
import { db } from "../config/db"
import { Roles, Users } from "@prisma/client"
import { StatusCodes } from "http-status-codes"

export const isLoggedIn = asyncHandler(async (req, res, next) => {
  let token

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1]
  }

  if (!token) {
    throw new AuthError()
  }

  try {
    const decodedJwtPayload = jwt.verify(token, config.JWT_SECRET) as JwtPayload

    req.body.loggedInUser = (await db.users.findUnique({
      where: {
        id: decodedJwtPayload.id,
      },
    })) as Users

    next()
  } catch (error) {
    throw new AuthError()
  }
})

export const authorize = (...requiredRoles: Roles[]) =>
  asyncHandler(async (req, res, next) => {
    if (!requiredRoles.includes(req.body.user.role)) {
      throw new ApiError(
        StatusCodes.FORBIDDEN,
        "You are not authorized to access this resource"
      )
    }
    next()
  })

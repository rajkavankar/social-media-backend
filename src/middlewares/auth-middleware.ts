import jwt, { type JwtPayload } from "jsonwebtoken"
import { asyncHandler } from "../utils/asyncHandler"
import { ApiError, AuthError } from "../utils/ApiError"
import { config } from "../config/config"
import { db } from "../config/db"
import { Roles, Users } from "@prisma/client"
import { StatusCodes } from "http-status-codes"
import { Request } from "express"

export const isLoggedIn = asyncHandler(async (req: Request, res, next) => {
  const token =
    req.cookies.token || req.headers["authorization"]?.replace("Bearet", "")

  if (!token) {
    throw new AuthError()
  }

  try {
    const decodedJwtPayload = jwt.verify(token, config.JWT_SECRET) as JwtPayload

    const user = await db.users.findUnique({
      where: {
        id: decodedJwtPayload.id,
      },
    })

    if (user) {
      req.user = user
    }

    if (next) {
      next()
    }
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
    if (next) {
      next()
    }
  })

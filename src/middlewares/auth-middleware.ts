import jwt, { JwtPayload, Secret } from "jsonwebtoken"
import { asyncHandler } from "../utils/asyncHandler"
import { AuthError } from "../utils/ApiError"
import { config } from "../config/config"
import { db } from "../config/db"
import { type Request, Response, NextFunction } from "express"
import { Users } from "@prisma/client"

export const isLoggedIn = asyncHandler(async (req, res, next) => {
  let token

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1]

    // token = "Bearer gbhnjm235r5hbnj"
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

import { asyncHandler } from "../utils/asyncHandler"
import { type loggedInUserType } from "../types/UserTypes"
import { db } from "../config/db"
import { StatusCodes } from "http-status-codes"
import { ApiResponse } from "../utils/ApiResponse"
import { ApiError, ServerError } from "../utils/ApiError"
import { Request } from "express"

export const followUser = asyncHandler(
  async (req: Request<{ userId?: string }>, res) => {
    const { userId } = req.params

    if (userId === req.user?.id) {
      throw new ApiError(StatusCodes.BAD_REQUEST, "Cannor follow yourself")
    }

    const isFollowing = await db.followers.findFirst({
      where: {
        AND: [
          {
            followingId: userId,
          },
          {
            followerId: req.user?.id,
          },
        ],
      },
    })

    if (isFollowing) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .json(new ApiResponse("Already following"))
    } else {
      console.log(req.user?.id)

      const followed = await db.followers.create({
        data: {
          followerId: req.user?.id!,
          followingId: userId!,
        },
      })
      if (followed) {
        res
          .status(StatusCodes.CREATED)
          .json(new ApiResponse("You started following"))
      } else {
        throw new ServerError()
      }
    }
  }
)

export const unFollowUser = asyncHandler(
  async (req: Request<{ userId?: string }>, res) => {
    const { userId } = req.params

    if (userId === req.user?.id) {
      throw new ApiError(StatusCodes.BAD_REQUEST, "Cannot un follow yourself")
    }

    const isFollowing = await db.followers.findFirst({
      where: {
        AND: [
          {
            followingId: userId!,
          },
          {
            followerId: req.user?.id!,
          },
        ],
      },
    })

    if (isFollowing) {
      const followed = await db.followers.delete({
        where: {
          id: isFollowing.id,
        },
      })
      if (followed) {
        res.status(StatusCodes.OK).json(new ApiResponse("You un followed"))
      } else {
        throw new ServerError()
      }
    } else {
      res
        .status(StatusCodes.BAD_REQUEST)
        .json(new ApiResponse("Already not following"))
    }
  }
)

export const getFollowDetails = asyncHandler(
  async (req: Request<{ userId?: string }>, res) => {
    const { userId } = req.params

    const followers = await db.followers.findMany({
      where: {
        followingId: userId!,
      },
    })
    const followings = await db.followers.findMany({
      where: {
        followerId: userId!,
      },
      include: {
        follower: {
          select: {
            id: true,
            name: true,
          },
        },
        following: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    })

    res
      .status(StatusCodes.OK)
      .json(new ApiResponse("follow details", { followers, followings }))
  }
)

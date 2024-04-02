import { asyncHandler } from "../utils/asyncHandler"
import { type loggedInUserType } from "../types/UserTypes"
import { db } from "../config/db"
import { StatusCodes } from "http-status-codes"
import { ApiResponse } from "../utils/ApiResponse"
import { ApiError, ServerError } from "../utils/ApiError"

export const followUser = asyncHandler(async (req, res) => {
  const { loggedInUser }: loggedInUserType = req.body
  const { userId } = req.params

  if (userId === loggedInUser.id) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Cannor follow yourself")
  }

  const isFollowing = await db.followers.findFirst({
    where: {
      AND: [
        {
          followingId: userId,
        },
        {
          followerId: loggedInUser.id,
        },
      ],
    },
  })

  if (isFollowing) {
    res
      .status(StatusCodes.BAD_REQUEST)
      .json(new ApiResponse("Already following"))
  } else {
    const followed = await db.followers.create({
      data: {
        followingId: userId,
        followerId: loggedInUser.id,
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
})

export const unFollowUser = asyncHandler(async (req, res) => {
  const { loggedInUser }: loggedInUserType = req.body
  const { userId } = req.params

  if (userId === loggedInUser.id) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Cannot un follow yourself")
  }

  const isFollowing = await db.followers.findFirst({
    where: {
      AND: [
        {
          followingId: userId,
        },
        {
          followerId: loggedInUser.id,
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
})

export const getFollowDetails = asyncHandler(async (req, res) => {
  const { userId } = req.params

  const followers = await db.followers.findMany({
    where: {
      followingId: userId,
    },
  })
  const followings = await db.followers.findMany({
    where: {
      followerId: userId,
    },
  })

  res
    .status(StatusCodes.OK)
    .json(new ApiResponse("follow details", { followers, followings }))
})

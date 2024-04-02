import { StatusCodes } from "http-status-codes"
import { db } from "../config/db"
import { type loggedInUserType } from "../types/UserTypes"
import { asyncHandler } from "../utils/asyncHandler"
import { ApiResponse } from "../utils/ApiResponse"
import { ServerError } from "../utils/ApiError"

export const likePost = asyncHandler(async (req, res) => {
  const { loggedInUser }: loggedInUserType = req.body
  const { postId } = req.params
  const liked = await db.likes.findFirst({
    where: {
      AND: [
        {
          postId,
        },
        {
          userId: loggedInUser.id,
        },
      ],
    },
  })

  if (liked) {
    res
      .status(StatusCodes.BAD_REQUEST)
      .json(new ApiResponse("Already iked the post"))
  } else {
    const like = await db.likes.create({
      data: {
        postId,
        userId: loggedInUser.id,
      },
    })

    if (like) {
      res.status(StatusCodes.CREATED).json(new ApiResponse("Liked the post"))
    } else {
      throw new ServerError()
    }
  }
})

export const unLikePost = asyncHandler(async (req, res) => {
  const { loggedInUser }: loggedInUserType = req.body
  const { postId } = req.params

  const liked = await db.likes.findFirst({
    where: {
      AND: [
        {
          postId,
        },
        {
          userId: loggedInUser.id,
        },
      ],
    },
  })

  if (liked) {
    const unlike = await db.likes.delete({
      where: {
        id: liked.id,
      },
    })

    if (unlike) {
      res.status(StatusCodes.CREATED).json(new ApiResponse("Unliked the post"))
    } else {
      throw new ServerError()
    }
  } else {
    throw new ServerError()
  }
})

export const getLikesByPost = asyncHandler(async (req, res) => {
  const { postId } = req.params
  const likes = await db.likes.findMany({
    where: {
      postId,
    },
  })

  res.status(StatusCodes.OK).json(new ApiResponse("Likes of post", likes))
})

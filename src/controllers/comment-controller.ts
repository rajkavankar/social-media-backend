import { type loggedInUserType } from "../types/UserTypes"
import { asyncHandler } from "../utils/asyncHandler"
import { ApiError, ServerError } from "../utils/ApiError"
import { StatusCodes } from "http-status-codes"
import { db } from "../config/db"
import { ApiResponse } from "../utils/ApiResponse"

export const addComment = asyncHandler(async (req, res) => {
  const { body, loggedInUser }: { body: string } & loggedInUserType = req.body
  const { postId } = req.params

  if (!body) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Plese add contoent to comment")
  }

  const comment = await db.comment.create({
    data: {
      body,
      postId,
      userId: loggedInUser.id,
    },
  })

  if (comment) {
    res
      .status(StatusCodes.CREATED)
      .json(new ApiResponse("Comment added", comment))
  } else {
    throw new ServerError()
  }
})

export const getCommentsByPost = asyncHandler(async (req, res) => {
  const { postId } = req.params

  const comments = await db.comment.findMany({
    where: {
      postId,
    },
  })

  if (comments) {
    res
      .status(StatusCodes.CREATED)
      .json(new ApiResponse("Comment for post", comments))
  } else {
    throw new ServerError()
  }
})

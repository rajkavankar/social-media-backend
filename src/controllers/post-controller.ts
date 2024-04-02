import { StatusCodes } from "http-status-codes"
import { asyncHandler } from "../utils/asyncHandler"
import { ApiResponse } from "../utils/ApiResponse"
import { ApiError, AuthError, ServerError } from "../utils/ApiError"
import { db } from "../config/db"
import { type loggedInUserType } from "../types/UserTypes"
import { Posts } from "@prisma/client"

export const createPost = asyncHandler(async (req, res) => {
  const { body, loggedInUser }: { body: string } & loggedInUserType = req.body

  if (!body) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Plese add contoent to post")
  }

  const post = await db.posts.create({
    data: {
      body: body,
      creatorId: loggedInUser.id,
    },
  })

  if (post) {
    res.status(StatusCodes.CREATED).json(new ApiResponse("Post created", post))
  } else {
    throw new ServerError()
  }
})

export const getPosts = asyncHandler(async (req, res) => {
  const posts: Posts[] = await db.posts.findMany()

  if (posts) {
    res.status(StatusCodes.OK).json(new ApiResponse("All posts", posts))
  } else {
    throw new ServerError()
  }
})

export const getPostById = asyncHandler(async (req, res) => {
  const { id } = req.params
  const post: Posts = await db.posts.findUnique({
    where: {
      id,
    },
  })

  if (post) {
    res.status(StatusCodes.OK).json(new ApiResponse("Post fetched", post))
  } else {
    throw new ServerError()
  }
})

export const getPostByUser = asyncHandler(async (req, res) => {
  const { userId } = req.params
  const posts: Posts[] = await db.posts.findMany({
    where: {
      creatorId: userId,
    },
  })

  if (posts) {
    res.status(StatusCodes.OK).json(new ApiResponse("Posts fetched", posts))
  } else {
    throw new ServerError()
  }
})

export const getPostByLoggedInUser = asyncHandler(async (req, res) => {
  const { loggedInUser }: loggedInUserType = req.body

  const posts = await db.posts.findMany({
    where: {
      creatorId: loggedInUser.id,
    },
  })

  if (posts) {
    res
      .status(StatusCodes.OK)
      .json(new ApiResponse("logged in user posts fetched", posts))
  } else {
    throw new ServerError()
  }
})

export const updatePost = asyncHandler(async (req, res) => {
  const { id } = req.params
  const { loggedInUser }: loggedInUserType = req.body
  const post: Posts = await db.posts.findUnique({
    where: {
      id,
    },
  })
  if (loggedInUser.id !== post.creatorId) {
    throw new AuthError()
  }

  const updatedPost = await db.posts.update({
    where: {
      id: post.id,
    },
    data: {
      body: req.body.body,
    },
  })

  if (updatedPost) {
    res
      .status(StatusCodes.OK)
      .json(new ApiResponse("Post updated", updatedPost))
  } else {
    throw new ServerError()
  }
})

export const deletePost = asyncHandler(async (req, res) => {
  const { id } = req.params
  const { loggedInUser }: loggedInUserType = req.body
  const post: Posts = await db.posts.findUnique({
    where: {
      id,
    },
  })
  if (loggedInUser.id !== post.creatorId) {
    throw new AuthError()
  }

  const deletedPost = await db.posts.delete({
    where: {
      id: post.id,
    },
  })

  if (deletedPost) {
    res
      .status(StatusCodes.OK)
      .json(new ApiResponse("Post deleted successfully"))
  } else {
    throw new ServerError()
  }
})

import { Request, Response } from "express"
import { StatusCodes } from "http-status-codes"
import { asyncHandler } from "../utils/asyncHandler"
import { ApiResponse } from "../utils/ApiResponse"
import { ApiError, AuthError, ServerError } from "../utils/ApiError"
import { db } from "../config/db"
import { Posts } from "@prisma/client"
import { uploadOnCloudinary } from "../helpers/cloudinary-service"

export const createPost = asyncHandler(
  async (req: Request<{}, {}, Posts>, res: Response<ApiResponse<Posts>>) => {
    const { body } = req.body

    let fileRes
    if (req.file) {
      // const response = await utapi.uploadFiles(req.file)
      fileRes = await uploadOnCloudinary(req.file.path)
    }

    if (!body) {
      throw new ApiError(StatusCodes.BAD_REQUEST, "Plese add contoent to post")
    }

    try {
      const post = await db.posts.create({
        data: {
          body: body,
          creatorId: req.user?.id!,
          mediaKey: fileRes ? fileRes.public_id : null,
          mediaUrl: fileRes ? fileRes.secure_url : null,
        },
        include: {
          creator: {
            select: {
              name: true,
              id: true,
            },
          },
        },
      })
      if (post) {
        res
          .status(StatusCodes.CREATED)
          .json(new ApiResponse("Post created", post))
      } else {
        throw new ServerError()
      }
    } catch (error) {
      throw new ServerError()
    }
  }
)

export const getPosts = asyncHandler(
  async (req, res: Response<ApiResponse<Posts>>) => {
    const posts = await db.posts.findMany({
      include: {
        creator: {
          select: {
            id: true,
            name: true,
          },
        },
        Comment: {
          select: {
            body: true,
            user: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        Likes: {
          select: {
            user: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    })

    if (posts) {
      res.status(StatusCodes.OK).json(new ApiResponse("All posts", posts))
    } else {
      throw new ServerError()
    }
  }
)

export const getPostById = asyncHandler(
  async (req: Request<{ id?: string }>, res) => {
    const { id } = req.params
    const post = await db.posts.findUnique({
      where: {
        id,
      },
      include: {
        creator: {
          select: {
            id: true,
            name: true,
          },
        },
        Comment: {
          select: {
            body: true,
            user: true,
          },
        },
        Likes: {
          select: {
            user: true,
          },
        },
      },
    })

    if (post) {
      res.status(StatusCodes.OK).json(new ApiResponse("Post fetched", post))
    } else {
      throw new ServerError()
    }
  }
)

export const getPostByUser = asyncHandler(async (req, res) => {
  const { userId } = req.params
  const posts = await db.posts.findMany({
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
  const posts = await db.posts.findMany({
    where: {
      creatorId: req.user?.id,
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

export const updatePost = asyncHandler(
  async (req: Request<{ id?: string }, {}, Posts>, res) => {
    const { id } = req.params
    const { body } = req.body
    const userID = req.user?.id
    const post = await db.posts.findUnique({
      where: {
        id,
      },
    })
    console.log(req.body)

    if (userID !== post?.creatorId) {
      throw new AuthError()
    }

    const updatedPost = await db.posts.update({
      where: {
        id: post?.id,
      },
      data: {
        body,
      },
    })

    console.log(updatedPost)
    if (updatedPost) {
      res
        .status(StatusCodes.OK)
        .json(new ApiResponse("Post updated", updatedPost))
    } else {
      throw new ServerError()
    }
  }
)

export const deletePost = asyncHandler(async (req, res) => {
  const { id } = req.params
  const userID = req.user?.id!
  const post = await db.posts.findUnique({
    where: {
      id,
    },
  })
  if (userID !== post?.creatorId) {
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

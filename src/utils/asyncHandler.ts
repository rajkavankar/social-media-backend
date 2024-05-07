import { type Request, Response, NextFunction } from "express"
import { ApiError } from "./ApiError"

type fnType = (
  req: Request,
  res: Response,
  next?: NextFunction
) => Promise<void>

export const asyncHandler =
  (fn: fnType) => async (req: Request, res: Response, next: NextFunction) => {
    try {
      await fn(req, res, next)
    } catch (error) {
      console.log(error)

      if (error instanceof ApiError) {
        res.status(error.statusCode ?? 500).json({
          success: false,
          message: error.message,
        })
      } else {
        res.status(500).json({
          success: false,
          message: "Some thing went wrong",
        })
      }
    }
  }

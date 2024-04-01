import { type Request, Response, NextFunction } from "express"

type fnType = (
  req: Request,
  res: Response,
  next?: NextFunction
) => Promise<void>

export const asyncHandler =
  (fn: fnType) => async (req: Request, res: Response, next?: NextFunction) => {
    try {
      await fn(req, res, next)
    } catch (error) {
      res.status(error.code ?? 500).json({
        success: false,
        message: error.message,
      })
    }
  }

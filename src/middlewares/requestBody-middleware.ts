import { type Request, Response, NextFunction } from "express"
import { type ZodSchema } from "zod"

export const requestBodyValidation = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const parsedBody = schema.safeParse(req.body)
    if (parsedBody.success) {
      return next()
    } else {
      return res.status(400).json({
        success: false,
        message: "Invalid data",
      })
    }
  }
}

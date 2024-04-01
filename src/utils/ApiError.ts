import { StatusCodes } from "http-status-codes"

export class ApiError extends Error {
  protected statusCode: number
  protected success: boolean
  constructor(statusCode: number, message = "Something went wrong") {
    super(message)
    this.statusCode = statusCode
    this.message = message
    this.success = false
  }
}

export class AuthError extends ApiError {
  constructor(
    statusCode = StatusCodes.UNAUTHORIZED,
    message = "Unauthorized access"
  ) {
    super(statusCode, message)
  }
}

export class ServerError extends ApiError {
  constructor(
    statusCode = StatusCodes.REQUEST_TIMEOUT,
    message = "Something went wrong"
  ) {
    super(statusCode, message)
  }
}

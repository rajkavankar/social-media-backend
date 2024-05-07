export interface ApiResponseType<T> {
  success: boolean
  message: string
  data?: T | T[]
}

export class ApiResponse<T> implements ApiResponseType<T> {
  success: boolean
  message: string
  data?: T | T[]
  constructor(message = "Success", data?: T | T[]) {
    this.success = true
    this.message = message
    this.data = data
  }
}

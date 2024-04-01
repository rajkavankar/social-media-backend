export class ApiResponse<U> {
  private success: boolean
  private message: string
  private data?: U | U[]
  constructor(message = "Success", data?: U | U[]) {
    this.success = true
    this.message = message
    this.data = data
  }
}

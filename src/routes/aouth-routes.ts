import { Router } from "express"
import { loginUser, registerUser } from "../controllers/auth-controller"
import { requestBodyValidation } from "../middlewares/requestBody-middleware"
import { loginSchema, registerSchema } from "../helpers/validations"
const router = Router()

router.post("/", requestBodyValidation(registerSchema), registerUser)
router.post("/login", requestBodyValidation(loginSchema), loginUser)

export { router as authRouter }

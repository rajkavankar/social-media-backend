import { Router } from "express"
import {
  loginUser,
  logout,
  profile,
  registerUser,
} from "../controllers/auth-controller"
import { requestBodyValidation } from "../middlewares/requestBody-middleware"
import { loginSchema, registerSchema } from "../helpers/validations"
import { isLoggedIn } from "../middlewares/auth-middleware"
const router = Router()

router.post("/", requestBodyValidation(registerSchema), registerUser)
router.post("/login", requestBodyValidation(loginSchema), loginUser)

router.get("/profile", isLoggedIn, profile)
router.get("/logout", logout)

export { router as authRouter }

import { Router } from "express"
import { authRouter } from "./aouth-routes"

const router = Router()

router.use("/auth", authRouter)

export { router }

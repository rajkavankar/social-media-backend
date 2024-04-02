import { Router } from "express"
import { authRouter } from "./auth-routes"
import { postRouter } from "./post-routes"
import { likeRouter } from "./like-routes"

const router = Router()

router.use("/auth", authRouter)
router.use("/posts", postRouter)
router.use("/likes", likeRouter)

export { router }

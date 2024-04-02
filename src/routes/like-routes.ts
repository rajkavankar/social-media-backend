import { Router } from "express"
import { isLoggedIn } from "../middlewares/auth-middleware"
import {
  getLikesByPost,
  likePost,
  unLikePost,
} from "../controllers/likes-controller"

const router = Router()

router.post("/:postId", isLoggedIn, likePost)
router.delete("/:postId", isLoggedIn, unLikePost)
router.get("/:postId", isLoggedIn, getLikesByPost)

export { router as likeRouter }

import { Router } from "express"
import { isLoggedIn } from "../middlewares/auth-middleware"
import {
  addComment,
  getCommentsByPost,
} from "../controllers/comment-controller"
const router = Router()

router.post("/:postId", isLoggedIn, addComment)
router.get("/:postId", isLoggedIn, getCommentsByPost)

export { router as commentRouter }

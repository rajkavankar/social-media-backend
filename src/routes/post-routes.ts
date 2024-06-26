import { Router } from "express"
import { isLoggedIn } from "../middlewares/auth-middleware"
import {
  createPost,
  deletePost,
  getPostById,
  getPostByLoggedInUser,
  getPostByUser,
  getPosts,
  updatePost,
} from "../controllers/post-controller"
const router = Router()
import { upload } from "../middlewares/multer-middleware"

router.get("/user", isLoggedIn, getPostByLoggedInUser)
router.post("/", upload.single("media"), isLoggedIn, createPost)
router.get("/", isLoggedIn, getPosts)
router.get("/:id", isLoggedIn, getPostById)
router.put("/:id", isLoggedIn, updatePost)
router.delete("/:id", isLoggedIn, deletePost)
router.get("/user/:userId", isLoggedIn, getPostByUser)

export { router as postRouter }

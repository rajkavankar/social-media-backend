import { Router } from "express"
import { isLoggedIn } from "../middlewares/auth-middleware"
import {
  followUser,
  getFollowDetails,
  unFollowUser,
} from "../controllers/following-controller"

const router = Router()

router.post("/:userId", isLoggedIn, followUser)
router.delete("/:userId", isLoggedIn, unFollowUser)
router.get("/:userId", isLoggedIn, getFollowDetails)

export { router as followingRouter }

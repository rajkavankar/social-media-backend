import express from "express"
import swaggerUi from "swagger-ui-express"
import { type Application } from "express"
import { router } from "./routes/index"
import cookieParser from "cookie-parser"
import fs from "fs"
import path from "path"
import Yaml from "yaml"
import cors from "cors"
import morgan from "morgan"

const app: Application = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())
app.use(cookieParser())

app.use("/api/v1", router)

app.use(morgan("dev"))

const file = fs.readFileSync(
  path.join(__dirname, "../documentation/swagger.yaml"),
  "utf8"
)
const swaggerDocument = Yaml.parse(file)

app.use("/", swaggerUi.serve, swaggerUi.setup(swaggerDocument))

// app.get("/", (_req, res) => {
//   res.status(200).json({
//     msg: "Health check",
//   })
// })

export { app }

import express from "express"
import swaggerUi from "swagger-ui-express"
import { type Application } from "express"
import { router } from "./routes/index"
import cookieParser from "cookie-parser"
import fs from "fs"
import path from "path"
import Yaml from "yaml"

const app: Application = express()

app.use(express.json({ limit: "32kb" }))
app.use(express.urlencoded({ extended: true, limit: "32kb" }))
app.use(cookieParser())
app.use("/api/v1", router)

const file = fs.readFileSync(
  path.join(__dirname, "../documentation/swagger.yaml"),
  "utf8"
)
const swaggerDocument = Yaml.parse(file)

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument))

app.get("/", (_req, res) => {
  res.status(200).json({
    msg: "Health check",
  })
})

export { app }

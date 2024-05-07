import { Users } from "@prisma/client"
import { app } from "./app"
import { config } from "./config/config"
import * as express from "express"

const { NODE_ENV, PORT } = config

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT} in ${NODE_ENV} environment`)
})

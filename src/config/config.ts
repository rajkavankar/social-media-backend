import dotenv from "dotenv"

dotenv.config()

export const config = {
  PORT: Number(process.env.PORT),
  NODE_ENV: String(process.env.NODE_ENV),
  JWT_SECRET: String(process.env.JWT_SECRET),
  JWT_EXPIRY: String(process.env.JWT_EXPIRY),
  CLOUDINARY_BUCKET: String(process.env.CLOUDINARY_BUCKET),
  CLOUDINARY_KEY: String(process.env.CLOUDINARY_KEY),
  CLOUDINARY_SECRET: String(process.env.CLOUDINARY_SECRET),
}

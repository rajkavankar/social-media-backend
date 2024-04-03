import fs from "fs"
import { v2 as cloudinary } from "cloudinary"
import { config } from "../config/config"

cloudinary.config({
  cloud_name: config.CLOUDINARY_BUCKET,
  api_key: config.CLOUDINARY_KEY,
  api_secret: config.CLOUDINARY_SECRET,
})

export const uploadOnCloudinary = async (localFilePath: string) => {
  try {
    if (!localFilePath) return null

    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    })
    fs.unlinkSync(localFilePath)
    return response
  } catch (error) {
    fs.unlinkSync(localFilePath)
    return null
  }
}

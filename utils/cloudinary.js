const dotenv = require("dotenv");
const { v2: cloudinary } = require("cloudinary");

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

function isCloudinaryConfigured() {
  return (
    !!process.env.CLOUDINARY_CLOUD_NAME &&
    !!process.env.CLOUDINARY_API_KEY &&
    !!process.env.CLOUDINARY_API_SECRET
  );
}

function sanitizeBase64(base64) {
  if (!base64 || typeof base64 !== "string") {
    throw new Error("INVALID_IMAGE_DATA");
  }

  if (base64.includes("base64,")) {
    return base64.split("base64,")[1];
  }

  return base64;
}

async function uploadMemberImageToCloudinary(base64, originalFilename = "member") {
  if (!isCloudinaryConfigured()) {
    throw new Error("CLOUDINARY_NOT_CONFIGURED");
  }

  const safeBase64 = sanitizeBase64(base64);
  const cleanName = `${Date.now()}-${(originalFilename || "member")}`
    .replace(/\.[^/.]+$/, "")
    .replace(/[^a-zA-Z0-9-_]/g, "-")
    .toLowerCase();

  return cloudinary.uploader.upload(`data:image/jpeg;base64,${safeBase64}`, {
    folder: "members",
    public_id: cleanName,
    overwrite: true,
    resource_type: "image",
  });
}

async function deleteMemberImageFromCloudinary(publicId) {
  if (!publicId) return null;
  if (!isCloudinaryConfigured()) {
    throw new Error("CLOUDINARY_NOT_CONFIGURED");
  }

  return cloudinary.uploader.destroy(publicId, {
    resource_type: "image",
    invalidate: true,
  });
}

module.exports = {
  uploadMemberImageToCloudinary,
  deleteMemberImageFromCloudinary,
  isCloudinaryConfigured,
};

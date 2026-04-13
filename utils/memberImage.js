const axios = require("axios");

async function getMemberImageBase64(img = {}) {
  if (img && img.url) {
    const response = await axios.get(img.url, {
      responseType: "arraybuffer",
      timeout: 20000,
    });
    return Buffer.from(response.data).toString("base64");
  }

  throw new Error("MEMBER_IMAGE_NOT_FOUND");
}

function sendMemberImageResponse(res, img = {}) {
  if (img && img.url) {
    return res.redirect(img.url);
  }

  throw new Error("MEMBER_IMAGE_NOT_FOUND");
}

module.exports = {
  getMemberImageBase64,
  sendMemberImageResponse,
};

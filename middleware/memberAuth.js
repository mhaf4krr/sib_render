const validateUser =
  require("../controllers/Member/authentication").validateUser;

const jwt = require("jsonwebtoken");

const verifyUser = async (req, res, next) => {
  let token = req.headers["x-auth-token"];

  try {
    if (!token) {
      throw new Error("TOKEN MISSING");
    } else {
      let decoded_token = jwt.verify(token, process.env["TOKEN_KEY"]);
      req["user"] = decoded_token;
      next();
    }
  } catch (error) {
    res.status(401).send(error.message);
  }
};

module.exports = verifyUser;

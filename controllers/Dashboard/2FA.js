const speakeasy = require("speakeasy");
const qrcode = require("qrcode");

const database = require("../../controllers/database");

const express = require("express");

const ROUTER = express.Router();

ROUTER.post("/set2FAState/:phone", async (req, res) => {
  try {
    let phone = req.params.phone;

    if (!phone) {
      throw new Error("Reg. Phone Missing");
    }

    let results = [];
    results = await database.queryDatabase("users", { phone });

    if (results.length == 0) {
      throw new Error("No User Found");
    }

    let user = results[0];

    await database.UpdateDatabase(
      "users",
      { phone },
      {
        $set: {
          "2FA_enabled": true,
        },
      }
    );

    res.send("ACTIVATED");
  } catch (error) {
    res.status(500).send(error.message);
  }
});

ROUTER.post("/generateSecret/:phone", async (req, res) => {
  try {
    let phone = req.params.phone;

    if (!phone) {
      throw new Error("Reg. Phone Missing");
    }

    let results = [];
    results = await database.queryDatabase("users", { phone });

    if (results.length == 0) {
      throw new Error("No User Found");
    }

    let user = results[0];

    if (user["2FA_enabled"]) {
      //ALREADY ENABLED

      qrcode.toDataURL(user["2FA"]["otpauth_url"], (err, data) => {
        if (err) {
          throw err;
        }

        res.send(data);
      });
    } else {
      //GENERATE A NEW TOKEN
      const secret = speakeasy.generateSecret({
        name: "SheikhImran2FA",
      });

      console.log(secret);

      //UPDATE USER IN DB WITH SECRET OF 2FA

      //UPDATE USER WITH TOKEN

      let UPDATE = {
        $set: {
          "2FA": { ...secret },
        },
      };

      await database.UpdateDatabase("users", { phone }, UPDATE);

      qrcode.toDataURL(secret.otpauth_url, (err, data) => {
        if (err) {
          throw err;
        }

        res.send(data);
      });
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
});

function verify2FAToken(secret, token) {
  try {
    return speakeasy.totp.verify({
      secret: secret,
      encoding: "ascii",
      token: token,
    });
  } catch (error) {
    throw error;
  }
}

module.exports = {
  ROUTER,
  verify2FAToken,
};

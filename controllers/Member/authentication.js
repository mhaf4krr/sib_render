const express = require("express");

const jwt = require("jsonwebtoken");

let ROUTER = express.Router();

let database = require("../database");

const bcrypt = require("bcrypt");

ROUTER.post("/login", express.json(), async (req, res) => {
  try {
    let { phone, password } = req.body;

    console.log(req.body);

    let user = await validateUser(phone, password);
    console.log(user);
    res.status(200).json(user);
  } catch (error) {
    console.error(error);

    res.status(401).send("CREDENTIALS DONT MATCH");
  }
});

let generateAuthToken = (user) => {
  let key = process.env["TOKEN_KEY"];
  let token = jwt.sign(user, key);

  return token;
};

let validateUser = async (phone, password) => {
  let result = await database.queryDatabase("members", {
    phone: phone,
  });

  if (result && result.length == 0) {
    throw new Error("USER DOESNT EXIST");
  } else {
    let user = result[0];

    console.log({
      user,
      incoming_password: password,
      hashed: await bcrypt.hash(password, await bcrypt.genSalt(12)),
    });

    const validPassword = await bcrypt.compare(password, user["password"]);

    if (!validPassword) {
      throw new Error("CREDENTIALS DO NOT MATCH");
    } else {
      let token = generateAuthToken(user);
      user["token"] = token;
      return user;
    }
  }
};

module.exports.validateUser = validateUser;
module.exports.ROUTER = ROUTER;

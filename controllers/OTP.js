const axios = require("axios");
const express = require("express");
const { queryDatabase } = require("./database");
const ROUTER = express.Router();

//2FACTOR SMS GATEWAY

const API_KEY = "b0d9bf63-6122-11e9-90e4-0200cd936042";

ROUTER.post("/generate/:phone/:type", async (req, res) => {
  try {
    let phone = req.params.phone;

    let type = req.params.type;

    if (type === "registration") {
      console.log("REGISTRATION");
      //CHECK IF THIS NUMBER IS ALREADY REGISTERED

      let results = await queryDatabase("members", { phone });
      if (results.length > 0) {
        throw new Error("This number is already registered");
      }
    }

    if (type === "user") {
      console.log("USER");
      //CHECK IF THIS NUMBER IS ALREADY REGISTERED

      let results = await queryDatabase("users", { phone });
      if (results.length > 0) {
        throw new Error("This number is already registered");
      }
    }

    if (type === "forgot") {
      //DO NOTHING
    }

    if (!phone) {
      throw new Error("PHONE NUMBER MISSING");
    }

    let url = `https://2factor.in/API/V1/${API_KEY}/SMS/+91${phone}/AUTOGEN/OTP2`;

    let response = await axios.get(url);

    let data = response.data;

    if (data["Status"] === "Success") {
      res.status(200).send("OTP DELIVERED");
    }
  } catch (error) {
    console.log(error);
    res.status(400).send(error.message);
  }
});

ROUTER.post("/verify/:phone/:otp", async (req, res) => {
  try {
    let phone = req.params.phone;
    let otp = req.params.otp;

    if (!phone || !otp) {
      throw new Error("MISSING DETAILS");
    }

    let url = `https://2factor.in/API/V1/${API_KEY}/SMS/VERIFY3/91${phone}/${otp}`;
    url = encodeURI(url);
    let response = await axios.get(url);

    let data = response.data;

    if (data["Status"] === "Success") {
      res.status(200).send("OK");
    } else {
      throw new Error("OTP Mismatch");
    }

    console.log(data);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

module.exports = ROUTER;

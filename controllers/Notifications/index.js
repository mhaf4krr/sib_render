const { Router } = require("express");
const express = require("express");
const database = require("../database");

const ROUTER = express.Router();

const sendNotification =
  require("../../utils/expoNotification").sendNotificationToDevice;

const sendNotificationToMultipleDevices =
  require("../../utils/expoNotification").sendNotificationToMultipleDevices;

ROUTER.post("/sendToDeivce/:token", express.json(), async (req, res) => {
  try {
    let message = req.body;

    let devicePushToken = req.params.token;

    if (!devicePushToken) {
      throw new Error("devicePushTokenMissing");
    }
    let receipt = await sendNotification(devicePushToken, {
      ...message,
      to: devicePushToken,
    });
    if (receipt) {
      res.status(200).send(receipt);
    }
  } catch (error) {
    console.log(error);
    res.status(500).send(error.message);
  }
});

ROUTER.post("/sendToMultiple", express.json(), async (req, res) => {
  try {
    let message = req.body;
    const PIPE = [
      {
        $project: {
          expoPushToken: 1,
          _id: 0,
        },
      },
    ];
    let pushTokens = await database.Aggregate("members", PIPE);

    let result = await sendNotificationToMultipleDevices(pushTokens, message);

    res.status(200).send();
  } catch (err) {
    console.log(err);
    res.status(500).send(err.message);
  }
});

module.exports = ROUTER;

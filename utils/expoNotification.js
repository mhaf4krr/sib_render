const { Expo } = require("expo-server-sdk");

const dotenv = require("dotenv");

dotenv.config();

let expo = new Expo({ accessToken: process.env.EXPO_ACCESS_TOKEN });

async function sendNotificationToDevice(pushToken, message) {
  try {
    let messages = [];
    if (!Expo.isExpoPushToken(pushToken)) {
      console.error(`Push token ${pushToken} is not a valid Expo push token`);
    } else {
      messages.push({
        to: pushToken,
        ...message,
      });

      return await expo.sendPushNotificationsAsync(messages);
    }
  } catch (error) {
    console.log(error);
    throw new Error(error.message);
  }
}

async function sendNotificationToMultipleDevices(pushTokens, message) {
  try {
    let messages = [];

    for (let item of pushTokens) {
      // Each push token looks like ExponentPushToken[xxxxxxxxxxxxxxxxxxxxxx]
      let pushToken = item["expoPushToken"];
      // Check that all your push tokens appear to be valid Expo push tokens
      if (!Expo.isExpoPushToken(pushToken)) {
        console.error(`Push token ${pushToken} is not a valid Expo push token`);
        continue;
      } else {
        //PUSH MESSAGE IN HERE
        messages.push({
          to: pushToken,
          ...message,
        });
      }

      // Construct a message (see https://docs.expo.io/push-notifications/sending-notifications/)
    }

    let chunks = expo.chunkPushNotifications(messages);
    let tickets = [];
    (async () => {
      // Send the chunks to the Expo push notification service. There are
      // different strategies you could use. A simple one is to send one chunk at a
      // time, which nicely spreads the load out over time:
      for (let chunk of chunks) {
        try {
          let ticketChunk = await expo.sendPushNotificationsAsync(chunk);
          console.log(ticketChunk);
          tickets.push(...ticketChunk);
          // NOTE: If a ticket contains an error code in ticket.details.error, you
          // must handle it appropriately. The error codes are listed in the Expo
          // documentation:
          // https://docs.expo.io/push-notifications/sending-notifications/#individual-errors
        } catch (error) {
          console.error(error);
        }
      }
    })();

    return tickets;
  } catch (error) {
    console.log(error);
  }
}

module.exports = {
  sendNotificationToDevice,
  sendNotificationToMultipleDevices,
};

const { Client, LocalAuth } = require("whatsapp-web.js")

module.exports = (io = Socket.Server) => {
  const client = new Client({
    puppeteer: {
      headless: false,
      args: ["--no-sandbox"],
    },
    authStrategy: new LocalAuth(),
  });

  io.on("connect", (socket) => {
    client.on("qr", (qr) => {
      console.log("QR RECEIVED");
      socket.emit("QRGenerated", qr);
    });

    client.on("ready", () => {
      console.log("Client is ready!");
      socket.emit("loadSuccess");
    });

    client.on("loading_screen", () => {
      console.log("loading screen");
    });

    client.on("authenticated", (session) => {
      // Save the session object however you prefer.
      // Convert it to json, save it to a file, store it in a database...

      console.log("CLIENT AUTHENTICATED");
    });

    socket.on("generateQR", async () => {
      try {
        let currentState = await client.getState();
        console.log({ currentState });
        if (
          currentState === "PAIRED" ||
          currentState === "CONNECTED" ||
          currentState === "OPENING"
        ) {
          socket.emit("loadSuccess");
          return;
        } else {
          client.initialize();
        }
      } catch (error) {
        client.destroy();
        client.initialize();
      }
    });

    socket.on("logout", async () => {
      try {
        await client.logout();
      } catch (error) {
        console.log(error);
      }
    });

    socket.on("sendMessage", async (data) => {
      try {
        let parsedData = JSON.parse(data);
        console.log(parsedData);
        let { numbers, message } = parsedData;

        //numbers is an array

        numbers = numbers.map((num) => {
          return `91${num}`;
        });

        let RESULT = [];

        for (number of numbers) {
          let res = await client.isRegisteredUser(number);
          console.log(res);

          let result = await client.sendMessage(`${number}@c.us`, message);

          console.log(result);
          RESULT.push(result);
        }

        socket.emit("meesageResult", JSON.stringify(RESULT));
      } catch (error) {
        console.log(error);
      }
    });
  });

  io.on("disconnect", () => {
    console.log("Client Disconnected");
  });

  client.initialize();
};

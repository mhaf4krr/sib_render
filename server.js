const { Server } = require("socket.io");

const express = require("express");
const path = require("path");
const fs = require("fs");

const dotenv = require("dotenv");

const bcrypt = require("bcrypt")

dotenv.config();

const app = express();

const OTP = require("./controllers/OTP");

const MEMBER = require("./controllers/Member/index");

const NOTIFICATIONS = require("./controllers/Notifications/index");

const DASHBOARD = require("./controllers/Dashboard/index");

const TFA = require("./controllers/Dashboard/2FA").ROUTER;

const locationData = require("./utils/location");

const PORT =
  Number(process.env.PORT) ||
  (process.env.ENV_CURRENT === "DEV" ? 3005 : 3011);

const expressServer = app.listen(PORT, () => {
  console.log("LISTENING ON " + PORT);
});

const io = new Server(expressServer, {
  cors: "*",
});

//const WHATSAPP = require("./controllers/WhatsApp/index")(io);

const cors = require("cors");

app.use(cors());

app.use("/OTP", OTP);

app.use("/member", MEMBER);

app.use("/dashboard", DASHBOARD);

app.use("/2FA", TFA);

app.get("/test", (req, res) => {
  res.send("HELLO");
});

app.use("/notify", NOTIFICATIONS);

app.get("/location", (req, res) => {
  try {
    res.json(locationData);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Serve client build from backend in non-dev environments.
if (process.env.ENV_CURRENT !== "DEV") {
  const clientBuildPath = path.resolve(__dirname, "./public/build");
  const clientIndexPath = path.join(clientBuildPath, "index.html");

  if (fs.existsSync(clientIndexPath)) {
    app.use(express.static(clientBuildPath));

    app.get("*", (req, res, next) => {
      const isDashboardGetApi =
        req.path.startsWith("/dashboard/member/image/") ||
        req.path.startsWith("/dashboard/reports/");

      if (req.path.startsWith("/OTP") ||
          req.path.startsWith("/member") ||
          req.path.startsWith("/2FA") ||
          req.path.startsWith("/notify") ||
          req.path.startsWith("/location") ||
          req.path.startsWith("/test") ||
          req.path.startsWith("/socket.io") ||
          isDashboardGetApi) {
        return next();
      }

      res.sendFile(clientIndexPath);
    });
  } else {
    console.log("Client build not found at", clientIndexPath);
  }
}




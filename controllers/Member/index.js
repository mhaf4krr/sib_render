const express = require("express");
const ROUTER = express.Router();

const bcrypt = require("bcrypt");
const database = require("../database");

const dotenv = require("dotenv");

dotenv.config();

const jwt = require("jsonwebtoken");

const { convert } = require("convert-svg-to-png");

// const sendEmail = require("../../utils/nodemailer");

const {
  uploadMemberImageToCloudinary,
  deleteMemberImageFromCloudinary,
} = require("../../utils/cloudinary");
const {
  getMemberImageBase64,
  sendMemberImageResponse,
} = require("../../utils/memberImage");

const generateMembershipID = require("./generateID");

const authMiddleware = require("../../middleware/memberAuth");

const sendNotificationToDevice =
  require("../../utils/expoNotification").sendNotificationToDevice;

const generateIDCard = require("./cardTemplate");

ROUTER.post("/register", express.json({ limit: "50mb" }), async (req, res) => {
  try {
    console.log("API HIT");
    let data = req.body;

    if (!data) {
      throw new Error("DATA MISSING");
    }

    // if (await checkIfAlreadyExists(data["email"])) {
    //   throw new Error("This Email is already Registered");
    // }

    //data["photograph"] = req["photograph"];

    if (await checkIfAlreadyExists(data["phone"])) {
      throw new Error("USER EXISTS");
    }

    let member_id = await generateMembershipID();

    data["member_id"] = member_id;

    if (!data["IMG"] || !data["IMG"]["base64"]) {
      throw new Error("MEMBER_IMAGE_REQUIRED");
    }

    const uploadedImage = await uploadMemberImageToCloudinary(
      data["IMG"]["base64"],
      data["IMG"]["filename"]
    );

    delete data["photo"];

    delete data["IMG"]["base64"];

    data["IMG"]["url"] = uploadedImage["secure_url"];
    data["IMG"]["public_id"] = uploadedImage["public_id"];

    data["dob"] = new Date(data["dob"]);

    data["dob_string"] = data["dob"].toLocaleDateString();

    //MEMBER STATUS

    data["status"] = "ACTIVE";

    //DESIGNATION

    data["designation"] = "MEMBER";

    data["authority"] = null;

    data["registered_on"] = new Date();

    //EXPIRATION AFTER 2 YEARS

    data["expiration"] = new Date().setFullYear(new Date().getFullYear() + 2);

    data["password"] = await bcrypt.hash(
      data["password"],
      await bcrypt.genSalt(12)
    );

    await database.insertIntoDatabase("members", data);

    console.log(data);
    res.status(200).send();
  } catch (error) {
    console.log(error);
    res.status(500).send(error.message);
  }
});



ROUTER.post("/update", express.json({ limit: "50mb" }), async (req, res) => {
  try {
    console.log("API HIT");
    let data = req.body;

    if (!data) {
      throw new Error("DATA MISSING");
    }

    // if (await checkIfAlreadyExists(data["email"])) {
    //   throw new Error("This Email is already Registered");
    // }

    //data["photograph"] = req["photograph"];

    console.log({data})

    let member_id = data["member_id"]

    if(data["IMG"]){
      if (data["IMG"]["base64"]) {
        const existingMembers = await database.queryDatabase("members", {
          member_id,
        });
        const existingMember = existingMembers && existingMembers[0];

        const uploadedImage = await uploadMemberImageToCloudinary(
          data["IMG"]["base64"],
          data["IMG"]["filename"]
        );

        if (
          existingMember &&
          existingMember["IMG"] &&
          existingMember["IMG"]["public_id"]
        ) {
          await deleteMemberImageFromCloudinary(
            existingMember["IMG"]["public_id"]
          );
        }

        data["IMG"]["url"] = uploadedImage["secure_url"];
        data["IMG"]["public_id"] = uploadedImage["public_id"];
      }

      delete data["photo"];
  
      delete data["IMG"]["base64"];
    }

    else delete data["IMG"]

    data["dob"] = new Date(data["dob"]);

    data["dob_string"] = data["dob"].toLocaleDateString();

   console.log({data})

   let tempData = {...data}

   delete tempData["_id"]

    let UPDATE = {
      $set:{
        ...tempData
      }
    }

    await database.UpdateDatabase("members",{
      member_id
    },UPDATE)

    console.log(data);
    res.status(200).send("UPDATED MEMBER");
  } catch (error) {
    console.log(error);
    res.status(500).send(error.message);
  }
});

ROUTER.post("/login", express.json(), async (req, res) => {
  try {
    let { phone, password } = req.body;

    console.log(req.body);

    let user = await validateUser(phone, password);
    console.log(user);
    res.status(200).json(user);
  } catch (error) {
    console.error(error);

    res.status(401).send(error.message);
  }
});

ROUTER.get("/generateIDCARD/:token", async (req, res) => {
  try {
    let token = req.params.token;

    console.log("GOT IDCARD REQ");
    if (!token) {
      throw new Error("TOKEN MISSING");
    }

    let decoded_token = jwt.verify(token, process.env["TOKEN_KEY"]);

    let USER = decoded_token;

    if (!USER) {
      throw new Error("AUTHENTICATION FAILED");
    }

    if (USER["member_id"]) {
      let results = await database.queryDatabase("members", {
        member_id: USER["member_id"],
      });
      if (results.length > 0) {
        USER = results[0];
      }
    }

    let IMGBASE64 = await getMemberImageBase64(USER["IMG"]);

    let IDCARD = generateIDCard(USER, IMGBASE64);

    let PNG_IMG = await convert(IDCARD, {
      height: "901",
      width: "1562",
      puppeteer: {
        headless: true,
        args: ["--no-sandbox"],
      },
    });

    res.status(200).set("Content-Type", "image/png").send(PNG_IMG);
  } catch (error) {
    console.log(error);
    res.status(500).send(error.message);
  }
});

ROUTER.get("/getPhoto/:token", async (req, res) => {
  try {
    let token = req.params.token;

    console.log("GOT IMG REQ");
    if (!token) {
      throw new Error("TOKEN MISSING");
    }

    let decoded_token = jwt.verify(token, process.env["TOKEN_KEY"]);

    let USER = decoded_token;

    if (!USER) {
      throw new Error("AUTHENTICATION FAILED");
    }

    if (USER["member_id"]) {
      let results = await database.queryDatabase("members", {
        member_id: USER["member_id"],
      });
      if (results.length > 0) {
        USER = results[0];
      }
    }

    sendMemberImageResponse(res, USER["IMG"]);
  } catch (error) {
    console.log(error);
    res.status(400).send(error.message);
  }
});

ROUTER.post("/syncToken", authMiddleware, express.json(), async (req, res) => {
  try {
    let { member_id, expoToken } = req.body;

    let UPDATE = {
      $set: {
        expoPushToken: expoToken,
      },
    };

    await database.UpdateDatabase("members", { member_id }, UPDATE);
    res.send("TOKEN UPDATED");
  } catch (err) {
    res.status(500).send(err.message);
  }
});

ROUTER.post(
  "/submitFeedback",
  authMiddleware,
  express.json(),
  async (req, res) => {
    try {
      let DATA = req.body;
      let USER = req.user;
      console.log(DATA, USER);

      delete USER["_id"];

      let FEEDBACK = { ...DATA, ...USER, received_at: new Date() };
      let result = await database.insertIntoDatabase("feedback", FEEDBACK);

      let receipt = await sendNotificationToDevice(USER["expoPushToken"], {
        title: "Feedback Received",
        body: "Feedback has been received, we shall get back to you on this soon.",
      });

      res.status(200).json(receipt);
    } catch (error) {
      console.log(error);
      res.status(400).send(error.message);
    }
  }
);

ROUTER.patch("/changePassword/:phone", express.json(), async (req, res) => {
  try {
    let phone = req.params.phone;
    console.log(req.body);
    let password = req.body["new_password"];
    console.log({ phone, password });

    let encrypted_password = await bcrypt.hash(
      password,
      await bcrypt.genSalt(12)
    );

    await database.UpdateDatabase(
      "members",
      { phone },
      {
        $set: {
          password: encrypted_password,
        },
      }
    );

    res.status(200).send("PASSWORD CHANGED");
  } catch (error) {
    res.status(500).send(error.message);
  }
});

//********************************** UTILITY FUNCTIONS *****************************/

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

    if (user["status"] === "INACTIVE") {
      throw new Error("THIS ACCOUNT IS INACTIVE, PLEASE CONTACT OFFICE");
    }

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

async function checkIfAlreadyExists(phone) {
  try {
    let results = await database.queryDatabase("members", { phone });
    if (results.length > 0) {
      throw new Error("USER ALREADY EXISTS.");
    }
  } catch (error) {
    throw new Error(error.message);
  }
}

module.exports = ROUTER;

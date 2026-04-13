const express = require("express");
const ROUTER = express.Router();

const bcrypt = require("bcrypt");
const database = require("../database");

const dotenv = require("dotenv");

const converter = require("json-2-csv");

const { convert } = require("convert-svg-to-png");

dotenv.config();

const jwt = require("jsonwebtoken");
const { verify2FAToken } = require("./2FA");

const generateIDCard = require("../Member/cardTemplate");

const expoPushNotification = require("../../utils/expoNotification");

const userAuthMiddleware = require("../../middleware/userAuth");

const filterByUser = require("../../utils/filterByUser");
const { Router } = require("express");
const {
  getMemberImageBase64,
  sendMemberImageResponse,
} = require("../../utils/memberImage");
const {
  deleteMemberImageFromCloudinary,
} = require("../../utils/cloudinary");

ROUTER.post(
  "/user/new",
  userAuthMiddleware,
  express.json(),
  async (req, res) => {
    try {
      let data = req.body;

      //CHECK IF USER ALREADY EXISTS

      console.log(data);

      data["phone"] = data["phone"] + "";

      data["password"] = await bcrypt.hash(
        data["password"],
        await bcrypt.genSalt(12)
      );

      data["active"] = true;

      data["registered_on"] = new Date();
      data["2FA_enabled"] = false;
      let result = await database.insertIntoDatabase("users", data);
      res.status(200).send("USER ADDED");
    } catch (error) {
      res.status(500).send(error.message);
    }
  }
);

ROUTER.post("/user/view", userAuthMiddleware, async (req, res) => {
  try {
    let results = await database.queryDatabase("users", {});
    res.json(results);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

ROUTER.post(
  "/user/changePassword/:phone",
  userAuthMiddleware,
  express.json(),
  async (req, res) => {
    try {
      let phone = req.params.phone;

      let DATA = req.body;

      if (!phone) {
        throw new Error("No Phone supplied!");
      }
      let results = await database.queryDatabase("users", { phone });

      if (results.length === 0) {
        throw new Error("No such User Found");
      }

      const USER = results[0];

      console.log(DATA, USER);

      let isValidExistingPassword = await bcrypt.compare(
        DATA["existingPassword"],
        USER["password"]
      );

      console.log(isValidExistingPassword);

      if (!isValidExistingPassword) {
        throw new Error("INVALID EXISTING PASSWORD");
      }

      if (DATA["newPassword"].length < 5) {
        throw new Error("Password Length should be greater than 5 characters");
      }

      newHashedPassword = await bcrypt.hash(
        DATA["newPassword"],
        await bcrypt.genSalt(12)
      );

      await database.UpdateDatabase(
        "users",
        { phone },
        {
          $set: {
            password: newHashedPassword,
          },
        }
      );

      res.status(200).send("PASSWORD CHANGED SUCCESSFULLY");
    } catch (error) {
      console.log(error);
      res.status(500).send(error.message);
    }
  }
);

// async function createUser() {
//   try {
//     let PASSWORD = await bcrypt.hash("Root@linux20", await bcrypt.genSalt(12));

//     let user = {
//       name: "Mufti Hyder",
//       phone: "7006225524",
//       password: PASSWORD,
//       role_assigned: "super_user",
//       constituency: "KHANYAR",
//       ward: "",
//     };

//     await database.insertIntoDatabase("users", user);
//   } catch (error) {
//     console.log(error);
//   }
// }

// setTimeout(() => {
//   createUser();
// }, 2000);

ROUTER.post("/user/delete/:phone", userAuthMiddleware, async (req, res) => {
  try {
    let phone = req.params.phone;
    if (!phone) {
      throw new Error("Phone Missing");
    }

    await database.RemoveFromDatabase("users", { phone });

    res.status(200).send("USER DELETED");
  } catch (error) {
    console.log(error);
    res.status(500).send(error.message);
  }
});

ROUTER.post(
  "/user/toggleActivation/:phone",
  userAuthMiddleware,
  async (req, res) => {
    try {
      let phone = req.params.phone;
      if (!phone) {
        throw new Error("Phone Missing");
      }
      let results = await database.queryDatabase("users", { phone });
      if (results.length == 0) {
        throw new Error("No user");
      }

      let user = results[0];

      let currentStatus = user["active"];

      let UPDATE = {
        $set: {
          active: !currentStatus,
        },
      };

      await database.UpdateDatabase("users", { phone }, UPDATE);

      res.send("CHANGED");
    } catch (error) {
      res.status(500).send(error.message);
    }
  }
);

ROUTER.post("/feedback/view", userAuthMiddleware, async (req, res) => {
  try {
    let results = await database.queryDatabase("feedback", {});

    res.json(results);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

ROUTER.post(
  "/member/view",
  userAuthMiddleware,
  express.json(),
  async (req, res) => {
    try {
      let FILTER = req.body;
      console.log({ FILTER });

      if (FILTER["filter_by"] === "WARD") {
        delete FILTER["halqa"];
        delete FILTER["filter_by"];
      } else if (FILTER["filter_by"] === "HALQA") {
        delete FILTER["ward"];
        delete FILTER["filter_by"];
      } else {
        //NO FILTER

        FILTER = {};
      }
      console.log({ FINAL_FILTER: FILTER });
      let results = await database.queryDatabase("members", { ...FILTER });

      res.json(results);
    } catch (error) {
      res.status(500).send(error.message);
    }
  }
);

ROUTER.post(
  "/member/birthday",
  userAuthMiddleware,
  express.json(),
  async (req, res) => {
    try {
      let MONTH = new Date().getMonth() + 1;

      let PIPLELINE = [
        {
          $addFields: {
            dob_month: {
              $month: "$$ROOT.dob",
            },
          },
        },

        {
          $match: {
            dob_month: MONTH,
          },
        },

        {
          $sort: {
            dob: 1,
          },
        },
      ];

      let results = await database.Aggregate("members", PIPLELINE);

      res.json(results);
    } catch (error) {
      res.status(500).send(error.message);
    }
  }
);

ROUTER.post(
  "/member/profile/:member_id",
  userAuthMiddleware,
  async (req, res) => {
    try {
      let member_id = req.params.member_id;
      let results = await database.queryDatabase("members", { member_id });
      if (results.length === 0) {
        throw new Error("NO MEMBER FOUND");
      }
      res.json(results[0]);
    } catch (error) {
      res.status(500).send(error.message);
    }
  }
);

ROUTER.get("/member/image/:member_id", async (req, res) => {
  try {
    let member_id = req.params.member_id;
    let token = req.query.token;

    if (!token) {
      throw new Error("No Token Supplied!");
    }

    let decoded_token = jwt.verify(token, process.env["TOKEN_KEY"]);
    let TOKEN_USER = decoded_token;

    let token_results = await database.queryDatabase("users", {
      _id: database.ObjectID(TOKEN_USER["_id"]),
    });
    if (token_results.length === 0) {
      throw new Error("No valid user for supplied Token");
    }

    TOKEN_USER = token_results[0];

    if (!TOKEN_USER["active"]) {
      throw new Error("This account is DISABLED");
    }

    let results = await database.queryDatabase("members", { member_id });
    if (results.length === 0) {
      throw new Error("NO MEMBER FOUND");
    }

    let USER = results[0];

    sendMemberImageResponse(res, USER["IMG"]);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

ROUTER.delete(
  "/member/delete/:member_id",
  userAuthMiddleware,
  async (req, res) => {
    try {
      const member_id = req.params.member_id;

      if (!member_id) {
        throw new Error("MEMBER_ID_MISSING");
      }

      const results = await database.queryDatabase("members", { member_id });
      if (!results || results.length === 0) {
        throw new Error("NO_MEMBER_FOUND");
      }

      const member = results[0];
      if (member["IMG"] && member["IMG"]["public_id"]) {
        await deleteMemberImageFromCloudinary(member["IMG"]["public_id"]);
      }

      await database.RemoveFromDatabase("members", { member_id });
      res.status(200).send("MEMBER_DELETED");
    } catch (error) {
      console.log(error);
      res.status(500).send(error.message);
    }
  }
);

ROUTER.post(
  "/member/toggleActivation/:phone",
  userAuthMiddleware,
  async (req, res) => {
    try {
      let phone = req.params.phone;
      if (!phone) {
        throw new Error("Phone Missing");
      }
      let results = await database.queryDatabase("members", { phone });
      if (results.length == 0) {
        throw new Error("No Member Found");
      }

      let user = results[0];

      let currentStatus = user["status"];

      let updatedStatus = null;

      updatedStatus = currentStatus === "ACTIVE" ? "INACTIVE" : "ACTIVE";

      let UPDATE = {
        $set: {
          status: updatedStatus,
        },
      };

      await database.UpdateDatabase("members", { phone }, UPDATE);

      res.send("CHANGED");
    } catch (error) {
      res.status(500).send(error.message);
    }
  }
);

ROUTER.post(
  "/member/generateIDCARD",
  userAuthMiddleware,
  express.json(),
  async (req, res) => {
    try {
      let data = req.body;

      console.log(data);

      let FILTER = {};
      FILTER[data["attribute"]] = data["value"];

      let results = await database.queryDatabase("members", FILTER);

      if (results.length === 0) {
        throw new Error("NO MEMBER FOUND FOR THESE VALUES");
      }

      let USER = results[0];

      if (!USER) {
        throw new Error("AUTHENTICATION FAILED");
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
  }
);

ROUTER.post(
  "/member/search",
  userAuthMiddleware,
  express.json(),
  async (req, res) => {
    try {
      let USERFILTER = filterByUser(req["user"]);
      let data = req.body,
        { attribute, value } = data;

      let FILTER = {};
      FILTER[attribute] = {
        $regex: value,
        $options: "i",
      };

      let results = await database.queryDatabase("members", {
        ...FILTER,
        ...USERFILTER,
      });
      res.json(results);
    } catch (error) {
      res.status(500).send(error.message);
    }
  }
);

ROUTER.post(
  "/member/elevation",
  userAuthMiddleware,
  express.json(),
  async (req, res) => {
    try {
      let DATA = req.body;
      console.log(DATA);

      let member_id = DATA["member_id"];

      if (!member_id) {
        throw new Error("MEMBER ID NOT SENT");
      }

      let results = await database.queryDatabase("members", { member_id });

      if (results.length === 0) {
        throw new Error("No Member Found!");
      }

      let MEMBER = results[0];

      delete DATA["member_id"];

      DATA["elevated_on"] = new Date();
      DATA["elevated_by"] = req["user"]["name"];

      let UPDATE = {
        $set: {
          designation: DATA["designation"],
          authority: DATA,
        },
      };
      await database.UpdateDatabase("members", { member_id }, UPDATE);

      res.status(200).send("MEMBER ELEVATED");
    } catch (error) {
      console.log(error);
      res.status(500).send(error.messagee);
    }
  }
);

ROUTER.post(
  "/member/revokeElevation/:member_id",
  userAuthMiddleware,
  express.json(),
  async (req, res) => {
    try {
      let member_id = req.params.member_id;

      if (!member_id) {
        throw new Error("MEMBER ID NOT SENT");
      }

      let results = await database.queryDatabase("members", { member_id });

      if (results.length === 0) {
        throw new Error("No Member Found!");
      }

      let MEMBER = results[0];

      let UPDATE = {
        $set: {
          designation: "MEMBER",
          authority: null,
        },
      };
      await database.UpdateDatabase("members", { member_id }, UPDATE);

      res.status(200).send("MEMBER ELEVATED REVOKED");
    } catch (error) {
      console.log(error);
      res.status(500).send(error.messagee);
    }
  }
);

ROUTER.post(
  "/member/showSpecialMembers",
  userAuthMiddleware,
  express.json(),
  async (req, res) => {
    try {
      let PIPE = [
        {
          $match: {
            authority: {
              $exists: true,
              $ne: null,
            },
          },
        },

        {
          $sort: {
            "authority.district": 1,
            "authority.constituency": 1,
            "authority.zone": 1,
            "authority.block": 1,
            "authority.halqa": 1,
            "authority.ward": 1,
            "authority.booth": 1,
          },
        },
      ];
      let results = await database.Aggregate("members", PIPE);

      res.status(200).json(results);
    } catch (error) {
      console.log(error);
      res.status(500).send(error.messagee);
    }
  }
);

ROUTER.post(
  "/member/updateDesignationOnCard/",
  userAuthMiddleware,
  express.json(),
  async (req, res) => {
    try {
      let member_id = DATA["member_id"];

      if (!member_id) {
        throw new Error("MEMBER ID NOT SENT");
      }

      let results = await database.queryDatabase("members", { member_id });

      if (results.length === 0) {
        throw new Error("No Member Found!");
      }

      let MEMBER = results[0];

      let UPDATE = {
        $set: {
          designation: DATA["card_designation"],
        },
      };
      await database.UpdateDatabase("members", { member_id }, UPDATE);

      res.status(200).send("MEMBER ELEVATED REVOKED");
    } catch (error) {
      console.log(error);
      res.status(500).send(error.messagee);
    }
  }
);

ROUTER.post(
  "/notification/all",
  userAuthMiddleware,
  express.json(),
  async (req, res) => {
    try {
      let details = req.body;

      //GET ALL TOKENS

      //   {
      //     "title":"Eid Greetings",
      //     "body":"Sheikh Imran wishes you a happy eid",
      //     "data":{
      //         "type":"message",
      //         "url":"https://timesofindia.indiatimes.com/thumb/msid-82606298,width-1200,height-900,resizemode-4/.jpg",
      //         "message":"Sheikh Imran along with all the members of the party wish you a happy and prosperous Eid"
      //     }
      // }

      console.log(details);

      let type = details["type"];

      let formatted_message = {};

      //IF SENDING A MESSAGE
      if (type === "message") {
        formatted_message = {
          title: details["title"],
          body: details["title"],
          data: {
            type: "message",
            url: details["image_url"],
            message: details["message"],
          },
        };
      } else {
        //IF SENDING A URL
        formatted_message = {
          title: details["title"],
          body: details["title"],
          data: {
            type: "link",
            url: details["feed_url"],
          },
        };
      }

      const PIPE = [
        {
          $project: {
            expoPushToken: 1,
            _id: 0,
          },
        },
      ];
      let pushTokens = await database.Aggregate("members", PIPE);

      let result = await expoPushNotification.sendNotificationToMultipleDevices(
        pushTokens,
        formatted_message
      );
      res.send("NOTIFICATION SEND");
    } catch (error) {
      res.status(500).send(error.message);
    }
  }
);

ROUTER.get("/reports/members", async (req, res) => {
  try {
    let results = await database.queryDatabase("members", {});
    const csv = await converter.json2csvAsync(results);
    res.status(200).attachment("members.csv").send(csv);
  } catch (err) {
    console.log(err);
    res.status(500).send(err.message);
  }
});

ROUTER.get("/reports/users", async (req, res) => {
  try {
    let results = await database.queryDatabase("users", {});
    const csv = await converter.json2csvAsync(results);
    res.status(200).attachment("users.csv").send(csv);
  } catch (err) {
    console.log(err);
    res.status(500).send(err.message);
  }
});

ROUTER.get("/reports/feedback", async (req, res) => {
  try {
    let results = await database.queryDatabase("feedback", {});
    const csv = await converter.json2csvAsync(results);
    res.status(200).attachment("feedback.csv").send(csv);
  } catch (err) {
    console.log(err);
    res.status(500).send(err.message);
  }
});

ROUTER.post("/login", express.json(), async (req, res) => {
  try {
    let { phone, password, tfa_token } = req.body;

    console.log(req.body);

    let user = await validateUser(phone, password, tfa_token);
    console.log(user);
    res.status(200).json(user);
  } catch (error) {
    console.error(error);

    res.status(401).send(error.message);
  }
});

let generateAuthToken = (user) => {
  let key = process.env["TOKEN_KEY"];
  let token = jwt.sign(user, key);

  return token;
};

let validateUser = async (phone, password, TFAtoken = "") => {
  let result = await database.queryDatabase("users", {
    phone: phone,
  });

  if (result && result.length == 0) {
    throw new Error("USER DOESNT EXIST");
  } else {
    let user = result[0];

    if (!user["active"]) {
      throw new Error("This account has been DISABLED!");
    }

    // console.log({
    //   user,
    //   incoming_password: password,
    //   hashed: await bcrypt.hash(password, await bcrypt.genSalt(12)),

    // });

    const validPassword = await bcrypt.compare(password, user["password"]);

    if (!validPassword) {
      throw new Error("CREDENTIALS DO NOT MATCH");
    } else {
      //CHECK FOR 2FA

      if (user["2FA_enabled"]) {
        if (!TFAtoken) {
          throw new Error("2FA Token Missing");
        }

        if (!verify2FAToken(user["2FA"]["ascii"], TFAtoken)) {
          throw new Error("2FA Token did not Match");
        }
      }

      let token = generateAuthToken(user);
      user["token"] = token;
      return user;
    }
  }
};

module.exports = ROUTER;

const jwt = require("jsonwebtoken");

const database = require("../controllers/database");

const verifyUser = async (req, res, next) => {
  let token = req.headers["x-auth-token"];

  try {
    if (!token) {
      throw new Error("TOKEN MISSING");
    } else {
      let decoded_token = jwt.verify(token, process.env["TOKEN_KEY"]);
      req["user"] = decoded_token;

      let USER = decoded_token;

      //GET USER FROM DB

      let results = await database.queryDatabase("users", {
        _id: database.ObjectID(USER["_id"]),
      });

      if (results.length === 0) {
        throw new Error("COULD NOT FIND VALID USER FOR TOKEN");
      }

      USER = results[0];

      if (!USER["active"]) {
        throw new Error("Account Disabled");
      }

      next();
    }
  } catch (error) {
    res.status(401).send(error.message);
  }
};

module.exports = verifyUser;

// db.createUser(
//     {
// user: "hyder",
// pwd: passwordPrompt(),
// roles: [ { role: "userAdminAnyDatabase", db: "admin" }, "readWriteAnyDatabase" ]
//     }
// )

// root@linux20

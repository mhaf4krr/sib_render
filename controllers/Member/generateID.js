const database = require("../database");

async function generateApplicationID() {
  try {
    let result = await database.queryDatabase("auxilary", {
      _id: "memberCount",
    });

    let currentValue = result[0].value;

    await database.UpdateDatabase(
      "auxilary",
      { _id: "memberCount" },
      {
        $inc: { value: 1 },
      }
    );

    let temp_id = "";

    let neededLength = 7;

    let currentValueStringLength = new String(currentValue).length;

    if (currentValueStringLength < neededLength) {
      let paddingRequired = neededLength - currentValueStringLength;

      //PADD WITH ZEROES

      for (let i = 0; i < paddingRequired; i++) {
        temp_id += "0";
      }
    }

    temp_id += currentValue + "";

    let application_id = `${temp_id}`;

    return application_id;
  } catch (err) {
    console.log(err);
  }
}

module.exports = generateApplicationID;

let filterByUser = (user) => {
  if (user["assigned_role"] === "SUPER USER") {
    return {};
  } else if (user["assigned_role"] === "CONSTITUENCY") {
    return {
      constituency: user["constituency"],
    };
  } else if (user["assigned_role"] === "HALQA") {
    return {
      ward: user["halqa"],
    };
  } else if (user["assigned_role"] === "WARD") {
    return {
      ward: user["ward"],
    };
  }
};

module.exports = filterByUser;

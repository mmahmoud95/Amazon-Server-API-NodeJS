const { log } = require("console");
const jwt = require("jsonwebtoken");
const { promisify } = require("util");

const authRole = async function (req, res, next) {

  if (!(req.userType)) {
    return res.status(401).json({ message: "please login first" });
  }
  try {
    if (req.userType == "admin") {
      id=req.id;
        next();
    }
    else{
        return res.status(401).json({ message: "you do not have the privileges" });

    }
  } catch (err) {
    res.status(401).json({ message: "please log in first" });
  }
};
module.exports = { authRole };
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const userMod = require("../models/user");

const auth = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;

    const verifyUser = jwt.verify(token, "mynameisasimsoftwareengineer");

    console.log(verifyUser._id);

    const userData = await userMod.findOne({ _id: verifyUser._id });
    console.log(userData);

    next();
  } catch (error) {
    res.status(500).send("there is an error in auth.js");
  }
};
``;
module.exports = auth;

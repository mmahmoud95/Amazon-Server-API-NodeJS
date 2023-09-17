const { userModel } = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt=require('jsonwebtoken')

// add  new user or sing up function    (/signup)
const signUp = async (req, res) => {
  email = req.body.email;
  password = req.body.password;
  if (!email || !password) {
    res
      .status(500)
      .json({ message: "please enter at least your email and password " });
  } else {
    try {
      let user = await userModel.findOne({ email });
      console.log("i am here");
      console.log(user);
      if (!user) {
        // create new user
        let newUser = await userModel.create(req.body);
        res.status(200).json({ message: "your data has been saved", newUser });
      } else {
        res.json({ message: "user already exist" });
      }
    } catch (err) {
      res.status(500).json({ message: "something is wrong with your data", err });
    }
  }
};
// log in
const logIn = async (req, res) => {
  email = req.body.email;
  password = req.body.password;
  if (!email || !password) {
    res.status(500).json({ message: "please enter your email and password " });
  } else {
    try {
      let user = await userModel.findOne({ email });

      let passCheck = await bcrypt.compare(password, user.password);
        // check info
// 
      if (user && passCheck) {
        //generate token 
        let token=jwt.sign({id:user._id,email:user.email,userType:user.userType},process.env.SECRET,{expiresIn:'1h'})
        res
          .status(200)
          .json({ message: "welcome to our site ", yourToken:token });
      } else {
        res
          .status(200)
          .json({ message: "your have to sign up first ", newUser });
      }
    } catch (err) {
      res.status(500).json({ message: "invalid email or invalid password", err: err });
    }
  }
};

module.exports = { signUp, logIn };

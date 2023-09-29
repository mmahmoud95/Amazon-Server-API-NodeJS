const { userModel } = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// add  new user or sing up function    (/signup)
const signUp = async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  if (!email || !password || !firstName || !lastName) {
    res.status(500).json({
      message:
        "please enter your first name and last name and your email and password ",
    });
  } else {
    try {
      let user = await userModel.findOne({ email });
      if (!user) {
        // create new user
        let newUser = await userModel.create(req.body);
        res.status(200).json({ message: "your data has been saved", newUser });
      } else {
        res.json({ message: "user already exist" });
      }
    } catch (err) {
      res
        .status(500)
        .json({ message: "something is wrong with your data", err });
    }
  }
};
// log in
const logIn = async (req, res) => {
  email = req.body.email;
  password = req.body.password;
  if (!email || !password) {
    res.status(400).json({ message: "please enter your email and password " });
  } else {
    try {
      let user = await userModel.findOne({ email });

      let passCheck = await bcrypt.compare(password, user.password);
      // check info
      //
      if (user && passCheck) {
        //generate token
        let token = jwt.sign(
          { id: user._id, email: user.email, userType: user.userType },
          "amazonCloneProject",
          { expiresIn: "24h" }
        );
        res
          .status(200)
          .json({ message: "welcome to our site ", yourToken: token });
      } else {
        res
          .status(200)
          .json({ message: "your have to sign up first ", newUser });
      }
    } catch (err) {
      res
        .status(500)
        .json({ message: "invalid email or invalid password", err: err });
    }
  }
};
// delete user by id
const deleteUser = async (req, res, next) => {
  //
  userId = req.body.id;
  if (userId) {
    if (!(await userModel.findById(userId))) {
      res.status(201).json({ message: "User not found in users " });
    } else {
      await userModel
        .findById(userId)
        .then((userModel) => userModel.deleteOne({ _id: userId}))
        .then(
          res
            .status(201)
            .json({ message: "User successfully deleted", userModel })
        );
    }
  } else {
    res.status(400).json({
      message: "userType is not admin",
    });
  }
};
// update user information//first name and last name
const updateUser = async (req, res, next) => {
  const id = req.id;
  var firstName = req.body.firstName;
  var lastName = req.body.lastName;
  // Verifying if userType and id is present
  if (firstName && lastName) {
      await userModel.updateOne(
        { _id: id },
        { firstName: firstName, lastName: lastName }
      );
      res
        .status(200)
        .json({ message: "user was edited successfully", firstName, lastName });
    } else if(!firstName || !lastName) {
      res.status(400).json({
        message: "please write new first name and last name",
      });
    }
   else  {
    res.status(400).json({ message: "name or Id not present" });
  }
}
const updateUserById = async (req, res, next) => {
  var userID=req.body.id
  console.log(userID);
  var firstName = req.body.firstName;
  var lastName = req.body.lastName;
  // Verifying if userType and id is present
  if (userID&&firstName && lastName) {
      await userModel.updateOne(
        { _id: userID },
        { firstName: firstName, lastName: lastName }
      );
      res
        .status(200)
        .json({ message: "user was edited successfully", firstName, lastName });
    } else if(!userID||!firstName || !lastName) {
      res.status(400).json({
        message: "please write user id , new first name and  new last name",
      });
    }
   else  {
    res.status(400).json({ message: "name or Id not present" });
  }
}

module.exports = { signUp, logIn, deleteUser,updateUserById,updateUser };
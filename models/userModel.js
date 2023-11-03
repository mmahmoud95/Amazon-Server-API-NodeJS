const mongoose = require("mongoose");
const bcrypt=require('bcryptjs')

var userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 4,
    maxlength: 10,
    required: true,
  },
  email: {
    type: String,
    unique:true,
    minlength: 12,
    maxlength: 50,
    required: true,
  },
  password: {
    type: String,
    minlength: 8,
    required: true,
  },
  ConfirmPassword:{
    type: String,
    minlength: 8,
    required: true,
  },
  userType:{
    type:String,
    default:"user",
    enum:["user","admin"]
  },
  address: {
    country: { type: String, minlength: 4},
    street1: {
      type: String,
      minlength: 4,
     
    },
    city: {
      type: String,
      minlength: 4,
     
    },
    province: { type: String, minlength: 4 },
    zip: { type: Number, minlength: 5},
  },
});
// hashing password
userSchema.pre('save',async function(next){
const salt=await bcrypt.genSaltSync(10);
 var hashed=await bcrypt.hash(this.password,salt);
this.password=hashed;
next()
})

var userModel = mongoose.model("User", userSchema);

module.exports={userModel}

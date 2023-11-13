//schema for collection category
const mongoose = require("mongoose");
const categoryschems = mongoose.Schema(
  {
    en: {
      name: {
        type: String,
        minlength: 5,
        maxlength: 20,
        require: true,
      },
    },
    ar: {
      name: {
        type: String,
        minlength: 5,
        maxlength: 20,
        require: true,
      },
    },
    status: {
      type: String,
      enum: ["done", "in stock", "in progress"],
      default: "done",
    },
  },
  { timestamps: true }
);
var categorymodel = mongoose.model("Category", categoryschems);
module.exports = categorymodel;

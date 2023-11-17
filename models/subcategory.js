//schema for collection subCategory
const mongoose = require("mongoose");
const subCategorySchema = mongoose.Schema(
  {
    en: {
      name: {
        type: String,
        minlength: 5,
        maxlength: 40,
        require: true,
      },
    },
    ar: {
      name: {
        type: String,
        minlength: 5,
        maxlength: 40,
        require: true,
      },
    },
    status: {
      type: String,
      enum: ["done", "in stock", "in progress"],
      default: "done",
    },
    categoryid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
  },
  { timestamps: true }
);
var subCategorymodel = mongoose.model("SubCategory", subCategorySchema);
module.exports = subCategorymodel;

const mongoose = require("mongoose");
const sub_subCategorySchema = mongoose.Schema(
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
    SubCategoryid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SubCategory",
      required: true,
    },
  },
  { timestamps: true }
);
var sub_subCategorymodel = mongoose.model(
  "sub_subCategor",
  sub_subCategorySchema
);
module.exports = sub_subCategorymodel;

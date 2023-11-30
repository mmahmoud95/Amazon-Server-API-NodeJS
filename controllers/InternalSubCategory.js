const fs = require("fs");
const sub_subCategorymodel = require("../models/InternalSubCategory");
//getallsub_Subcategory
const getallSub_subcategory = async (req, res) => {
  try {
    var sub_subCategory = await sub_subCategorymodel
      .find()
      .populate("SubCategoryid");
    res.status(201).json(sub_subCategory);
  } catch (err) {
    res.status(500).json({
      message: "sub_subCategory not found",
    });
  }

};
//getsub_subCategoryByid
const getSub_subcategoryByid = async (req, res) => {
  var id = req.params.id; //param object contain id
  try {
    const sub_subCategory = await sub_subCategorymodel
      .findOne({
        _id: id,
      })
      .populate("SubCategoryid");
    if (sub_subCategory) {
      res.status(200).json(sub_subCategory);
    } else {
      res.status(404).json({
        message: "this  sub_subCategory not exist",
      });
    }
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

//get subSubcategories of specific subcategory:

const subOfSubCategoery = async (req, res) => {
  var parentSubCategory = req.params.subId;
  try {
    const subOfsubCtegorie = await sub_subCategorymodel
      .find({ SubCategoryid: parentSubCategory })
      .populate("SubCategoryid");
      
    res.status(201).json(subOfsubCtegorie);
  } catch {
    res.status(500).json({ message: error.message });
  }
};

//post
const saveSub_subcategory = async (req, res) => {
  var sub_subCategory = req.body;
  console.log(req.id);
  try {
    var new_sub_subCategory = await sub_subCategorymodel.create(
      sub_subCategory
    );
    console.log("Created At:", sub_subCategory.createdAt);
    console.log("Updated At:", sub_subCategory.updatedAt);
    res
      .status(201)
      .json({
        message: "sub_subCategory saved successfully",
        date: new_sub_subCategory,
      });
  } catch (err) {
    res.status(400).json({
      message: err.message,
    });
  }
};
//update
const patchSub_subcategory = async (req, res) => {
  var { name } = req.body; //new title
  var { id } = req.params;
  try {
    const queryRes3 = await sub_subCategorymodel.updateOne(
      { _id: id },
      { name: name }
    );
    console.log(queryRes3);
    res.json({
      message: "updated successfully",
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};
//delet
const deletSub_subcategory = async (req, res) => {
  var { id } = req.params;
  try {
    var sub_subCategory = await sub_subCategorymodel.deleteOne({ _id: id });

    console.log(sub_subCategory);
    res.json({ message: "delet run successfully" });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};
module.exports = {
  getallSub_subcategory,
  saveSub_subcategory,
  getSub_subcategoryByid,
  patchSub_subcategory,
  deletSub_subcategory,
  subOfSubCategoery,
};

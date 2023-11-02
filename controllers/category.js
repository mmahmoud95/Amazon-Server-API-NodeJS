const fs = require("fs");
const categorymodel = require("../models/category");
//getallCategory
const getallCategory = async (req, res) => {
    try {
        var category = await categorymodel.find();
        res.status(201).json(category);
    } catch (err) {
        res.status(500).json({
            message: "categoty not found",
        });
    }

    // console.log(category);
    // res.json(category);
};
//getCategoryByid
const getCategoryByid = async (req, res) => {
    var id = req.params.id; //param object contain id
    try {
        const category = await categorymodel.findOne({
            _id: id,
        });
        if (category) {
            res.status(200).json(category);
        } else {
            res.status(404).json({
                message: "category not exist",
            });
        }
    } catch (err) {
        res.status(500).json({
            message: err.message,
        });
    }
};
//postCategory
const saveCategory = async (req, res) => {
    var category = req.body; //body contain datain req
    console.log(req.id);
    try {
        var newcategory = await categorymodel.create(category);
        console.log("Created At:", category.createdAt);
        console.log("Updated At:", category.updatedAt);
        res.status(201).json({ message: "category save", date: newcategory });
    } catch (err) {
        res.status(400).json({
            message: err.message,
        });
    }
};
//updateCategory
const patchCategory = async (req, res) => {
    var { name } = req.body; //new title
    var { id } = req.params;
    try {
        const queryRes = await categorymodel.updateOne(
            { _id: id },
            { name: name }
        );
        // console.log(queryRes);
        res.json({
            message: "updated",
        });
    } catch (err) {
        res.status(500).json({
            message: err.message,
        });
    }
};
//deletCategory
const deletCategory = async (req, res) => {
    var { id } = req.params;
    try {
        var category = await categorymodel.deleteOne({ _id: id });

        // console.log(category);
        res.json({ message: "delet run" });
    } catch (err) {
        res.status(500).json({
            message: err.message,
        });
    }
};
module.exports = {
    getallCategory,
    saveCategory,
    getCategoryByid,
    patchCategory,
    deletCategory,
};

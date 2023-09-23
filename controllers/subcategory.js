const fs=require("fs")
const subCategorymodel=require("../models/subcategory")
//getallSubcategory
const getallSubcategory = async (req, res) => {
    try {
        var subCategory = await subCategorymodel.find().populate("categoryid")
        res.status(201).json(subCategory)
    } catch (err) {
        res.status(500).json({
            message: "subCategory not found"
        })

    } 

    console.log(subCategory)
    res.json(subCategory)
}
 //getsubCategoryByid
const getSubcategoryByid = async (req, res) => {
    var id = req.params.id //param object contain id
    try {
        const subCategory = await subCategorymodel.findOne({
            _id: id
        }).populate("categoryid")
        if (subCategory) {
            res.status(200).json(subCategory)
        } else {
            res.status(404).json({
                message: "subCategory not exist"
            })
        }
    } catch (err) {
        res.status(500).json({
            message: err.message
        })

    }
}
//post
const saveSubcategory = async (req, res) => {
    var subCategory = req.body 
    console.log(req.id)
    try {
        var newsubCategory = await subCategorymodel.create(subCategory)
        console.log("Created At:", subCategory.createdAt);
        console.log("Updated At:", subCategory.updatedAt);
        res.status(201).json({  message: "subCategory save",date: newsubCategory })
    } catch (err) {
        res.status(400).json({
            message: err.message
    })
    }

}
//update
const patchSubcategory = async (req, res) => {
    var {name} = req.body; //new title
    var {id} = req.params;
    try {
        const queryRes2 = await subCategorymodel.updateOne({ _id: id }, { name: name })
        console.log(queryRes2)
        res.json({
            message: "updated"
        })
    } catch (err) {
        res.status(500).json({
            message: err.message
        })
    }

}
//delet
const deletSubcategory=async(req,res)=>{
    var {id}=req.params;
  try{
    var subCategory= await subCategorymodel.deleteOne({ _id: id})

console.log(subCategory)
res.json({message:"delet run"})

}
catch(err){
    res.status(500).json({
        message:err.message
    })
}
}
module.exports = { getallSubcategory, saveSubcategory, getSubcategoryByid, patchSubcategory, deletSubcategory}

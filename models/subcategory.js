//schema for collection subCategory
const mongoose = require('mongoose')
const subCategorySchema = mongoose.Schema({
    name: {
        type: String,
        minlength: 2,
        maxlength: 20,
        required: true,
    },
    status: {
        type: String,
        enum: ["to-do", "in progress", "done"],
        default: "to-do"
    } ,
    categoryid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required:true
    }},
    {timestamps: true}
)
var subCategorymodel = mongoose.model('SubCategory', subCategorySchema)
module.exports =subCategorymodel;
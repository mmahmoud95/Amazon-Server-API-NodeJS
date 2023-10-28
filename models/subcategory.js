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
        enum: ["done","in stock", "in progress"],
        default: "done"
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
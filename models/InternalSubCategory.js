const mongoose = require('mongoose')
const sub_subCategorySchema = mongoose.Schema({
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
    }  , 
    SubCategoryid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'SubCategory',
        required:true
    }
},
    {timestamps: true}
)
var sub_subCategorymodel = mongoose.model('sub_subCategor', sub_subCategorySchema)
module.exports =sub_subCategorymodel;
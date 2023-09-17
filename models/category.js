//schema for collection category
const mongoose = require('mongoose')
const categoryschems = mongoose.Schema({
  
    name: {
        type: String,
        minlength: 2,
        maxlength: 20,
        require: true,
    },
    status: {
        type: String,
        enum: ["to-do", "in progress", "done"],
        default: "to-do"
    } 
}, 
{timestamps: true}
)
var categorymodel = mongoose.model('Category', categoryschems) 
module.exports = categorymodel

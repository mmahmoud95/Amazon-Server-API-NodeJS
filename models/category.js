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
        enum: ["done","in stock", "in progress"],
        default: "done"
    } 
}, 
{timestamps: true}
)
var categorymodel = mongoose.model('Category', categoryschems) 
module.exports = categorymodel

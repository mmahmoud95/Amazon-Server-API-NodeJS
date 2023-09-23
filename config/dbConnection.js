// for connecting to our database

const mongoose=require('mongoose')

const dbConnect=()=>{
mongoose.connect('mongodb://127.0.0.1:27017/Amazon').then(()=>{
    console.log("connected to Amazon_Api successfully");
}).catch((err)=>{
    console.log(err);
})    
}

module.exports={dbConnect}
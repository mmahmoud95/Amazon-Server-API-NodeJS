
// for server
const express=require('express')
const app=express()


// for connect to mongoDB
const {dbConnect}=require('./config/dbConnection');
const { auth } = require('./middlewares/userAuth');
// parsing
app.use(express.json());
// router for user operations
const userRoutes=require('./routes/userRoute',auth)
dbConnect()


app.use('/api/user',userRoutes)



app.use('/',(req,res,next)=>{
    res.status(404).json("url not found")
})


app.listen('2000',()=>
console.log("server listening on port 2000")
);


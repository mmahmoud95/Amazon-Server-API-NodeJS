// for server
const express = require("express");
const mongoose = require("mongoose");
const app = express();
const dotenv= require('dotenv')
//config.env
dotenv.config({path:'config.env'});

// for connect to mongoDB
const { dbConnect } = require("./config/dbConnection");
dbConnect();
// parsing
app.use(express.json());

// const { auth } = require('./middlewares/userAuth');
const categoryRout = require("./routes/category");
const subcategoryRout = require("./routes/subcategory");
const subSubCategoryRout = require("./routes/InternalSubCategory");

const userRoutes = require("./routes/userRoute");

const productRout = require("./routes/product");
const cartRout = require("./routes/cart");
const orderRoutes= require('./routes/order')

//for users
app.use("/api/user", userRoutes);

///////////////////////////////////// for category
app.use("/category", categoryRout);
app.use("/subcategory", subcategoryRout);
app.use("/subcategory/sub", subSubCategoryRout);

//////for product
app.use("/cart", cartRout);
app.use("/products", productRout);

//for order:
app.use("/order",orderRoutes)

app.use("/", (req, res, next) => {
    res.status(404).json("url not found");
});


//port
const port = 3333;
app.listen(port, () => {
    console.log("server listen", port);
});

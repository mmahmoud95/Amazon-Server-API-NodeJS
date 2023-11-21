// for server
const express = require("express");
const mongoose = require("mongoose");
const app = express();
var corsMiddleware = require("cors");
require("dotenv").config();

const dotenv = require("dotenv");
//config.env
dotenv.config({ path: "config.env" });

// for connect to mongoDB
const { dbConnect } = require("./config/dbConnection");
dbConnect();

app.use(
    corsMiddleware({
        //origin: 'https://amzon.com/,
        origin: "*",
        //  methods: "GET",
    })
);
// parsing
app.use(express.json());

// const { auth } = require('./middlewares/userAuth');
const categoryRout = require("./routes/category");
const subcategoryRout = require("./routes/subcategory");
const subSubCategoryRout = require("./routes/InternalSubCategory");

const userRoutes = require("./routes/userRoute");
const reviewRoutes = require("./routes/reviews");
const productRout = require("./routes/product");
const cartRout = require("./routes/cart");
const orderRoutes = require("./routes/order");

//for users
app.use("/api/user", userRoutes);

///////////////////////////////////// for category
app.use("/category", categoryRout);
app.use("/subcategory/sub", subSubCategoryRout);
app.use("/subcategory", subcategoryRout);

//////for product
app.use("/cart", cartRout);
app.use("/products", productRout);

//for order:
app.use("/order", orderRoutes);

// for reviews

app.use("/review", reviewRoutes);

app.use("/", (req, res, next) => {
    res.status(404).json("url not found");
});

//port
const port = 3333;
app.listen(port, () => {
    console.log("server listen", port);
});

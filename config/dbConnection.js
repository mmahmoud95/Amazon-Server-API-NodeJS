// for connecting to our database

const mongoose = require("mongoose");

const dbConnect = () => {
    mongoose
        .connect(
            "mongodb+srv://mustafamhmod95:bYrUCQ2Jf6z3ZU8w@amazon.fj4moo9.mongodb.net/AmazonDB"
            
        //    "mongodb+srv://martina:SOOoLB2ty9DX4R8l@amazon.fj4moo9.mongodb.net/Amazon"
           
        )
        // .connect("mongodb://127.0.0.1:27017/Amazon")
        .then(() => {
            console.log("connected to Amazon_Data_Base successfully");
        })
        .catch((err) => {
            console.log(err,"could not connect to Amazon db");
        });
};

module.exports = { dbConnect };

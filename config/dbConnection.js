// for connecting to our database

const mongoose = require("mongoose");

const dbConnect = () => {
    mongoose
        .connect(
            "mongodb+srv://mustafamhmod95:bYrUCQ2Jf6z3ZU8w@amazon.fj4moo9.mongodb.net/"
        )
        .then(() => {
            console.log("connected to Amazon_Api successfully");
        })
        .catch((err) => {
            console.log(err);
        });
};

module.exports = { dbConnect };

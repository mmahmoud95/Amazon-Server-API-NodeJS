const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
    {
        reviewMessage: {
            type: String,
        },
        ratings: {
            type: Number,
            // min: [1, "Min ratings value is 1.0"],
            // max: [5, "Max ratings value is 5.0"],
            // required: [true, "review ratings required"],
        },
        userId: {
            type: mongoose.Schema.ObjectId,
            ref: "User",
            // required: [true, "Review must belong to user"],
        },
        // parent reference (one to many)
        product: {
            type: mongoose.Types.ObjectId,
            ref: "Product",
            // required: [true, "Review must belong to product"],
        },
    },
    { timestamps: true }
);

// reviewSchema.pre(/^find/, function (next) {
//     this.populate({ path: "user", select: "name" });
//     next();
// });

const reviewModel = mongoose.model("Review", reviewSchema);

module.exports = reviewModel;

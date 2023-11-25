const reviewModel = require("../models/reviews");
const productModel = require("../models/product");
const mongoose = require("mongoose");
const {
    Types: { ObjectId },
} = mongoose;

const addNewReview = async (req, res) => {
    const { reviewMessage } = req.body;
    const { ratings } = req.body;
    const userId = req.id;
    const { productId } = req.body;

    try {
        const review = await reviewModel.findOne({
            userId: userId,
            product: productId,
        });
        if (!review) {
            const newReview = await reviewModel.create({
                reviewMessage,
                ratings,
                userId,
                product: productId,
            });

            res.status(201).json({
                message: "Review Added successfully",
                data: newReview,
            });
            const upadateProductRating = await reviewModel.aggregate([
                { $match: { product: new ObjectId(productId) } },
                {
                    $group: {
                        _id: "product",
                        avgRatings: { $avg: "$ratings" },
                        ratingsQuantity: { $sum: 1 },
                    },
                },
            ]);
            if (upadateProductRating.length > 0) {
                await productModel.findByIdAndUpdate(productId, {
                    rating: Math.round(upadateProductRating[0].avgRatings),
                    ratingQuantity: upadateProductRating[0].ratingsQuantity,
                });
                console.log(upadateProductRating);
            } else {
                await productModel.findByIdAndUpdate(productId, {
                    rating: 0,
                    ratingQuantity: 0,
                });
            }
        } else {
            res.status(201).json({
                message: "You Already added review for this product",
            });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const getReviews = async (req, res) => {
    const productId = req.params.productId;
    try {
        const Reviews = await reviewModel
            .find({ product: productId })
            .populate("userId");
        let rating = 0;
        for (const i in Reviews) {
            rating += Reviews[i].ratings;
        }
        rating = Math.round(rating / Reviews.length);
        res.status(200).json({
            message: "get Reviews successfully",
            data: Reviews,
            rating: rating,
            numberOfRatings: Reviews.length,
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
module.exports = { addNewReview, getReviews };

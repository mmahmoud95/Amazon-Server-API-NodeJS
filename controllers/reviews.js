const reviewModel = require("../models/reviews");

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
            .populate('userId');
        res.status(200).json({
            message: "get Reviews successfully",
            data: Reviews,
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
module.exports = { addNewReview, getReviews };

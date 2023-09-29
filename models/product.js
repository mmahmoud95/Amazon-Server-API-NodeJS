const mongoose = require("mongoose");

const productSchema = mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        descreption: {
            type: String,
            required: true,
        },
        imageUrl: {
            type: String,
            required: true,
        },
        category: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: "SubCategory",
        },
        sku: {
            type: String,
            required: true,
        },
        quantity: {
            type: Number,
            required: true,
        },
        price: {
            type: Number,
            required: true,
        },
        rating: {
            type: Number,
            required: true,
        },
    },
    // skus: {
    //     type: Array,
    //     required: true,
    //     sku: {
    //         type: Number,
    //         required: true,
    //     },
    //     quantity: {
    //         type: Number,
    //         required: true,
    //     },
    //     price: {
    //         type: Number,
    //         required: true,
    //     },
    //     option: {
    //         type: Array,
    //         required: false,
    //     },
    // },

    { timestamps: true }
);

const productModel = mongoose.model("Product", productSchema);
module.exports = productModel;

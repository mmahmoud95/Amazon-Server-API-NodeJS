const mongoose = require("mongoose");

const productSchema = mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        thumbnail: {
            type: String,
            required: true,
        },
        images: { type: Array, required: true },
        category: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: "Category",
        },
        subCategory: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: "SubCategory",
        },
        subSubCategor: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: "sub_subCategor",
        },
        sku: {
            type: String,
            required: true,
            unique: true,
        },
        quantityInStock: {
            type: Number,
            required: true,
        },
        price: {
            type: Number,
            required: true,
        },
        discountPercentage: {
            type: Number,
            required: true,
        },
        rating: {
            type: Number,
            required: true,
        },
        brand: {
            type:String,
            required:true
        }
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

const mongoose = require("mongoose");

const productSchema = mongoose.Schema(
	{
		en: {
			title: {
				type: String,
				required: true,
			},
			description: {
				type: String,
				required: true,
			},
			brand: {
				type: String,
				required: true,
			},
		},
		ar: {
			title: {
				type: String,
				required: true,
			},
			description: {
				type: String,
				required: true,
			},
			brand: {
				type: String,
				required: true,
			},
		},
		thumbnail: {
			type: String,
			required: true,
		},
		images: {type: Array},
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
			// required: true,
			default: 0,
		},
		ratingQuantity: {type: Number, default: 0},
		rating: {
			type: Number,
			default: 0,
		},
		sold: {
			type: Number,
			default: 0,
		},
		createdBy: {
			type: mongoose.SchemaTypes.ObjectId,
			ref: "User",
			required: true,
		},
	},

	{timestamps: true}
);

const productModel = mongoose.model("Product", productSchema);
module.exports = productModel;

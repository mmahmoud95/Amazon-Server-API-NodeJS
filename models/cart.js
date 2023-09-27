const mongoose = require("mongoose");

const cartSchema = mongoose.Schema(
    {
        userId: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: "users",
        },
        items: [
            {
                productId: {
                    type: mongoose.SchemaTypes.ObjectId,
                    ref: "products",
                },
                quantity: {
                    type: Number,
                    required: true,
                    default: 1,
                },
                price: Number,
            },
        ],
        bill: {
            type: Number,
            required: true,
            default: 0,
        },
    },
    { timestamps: true }
);

const cartModel = mongoose.model("Cart", cartSchema);
module.exports = cartModel;

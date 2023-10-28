const cartModel = require("../models/cart");

const addNewCart = async (req, res) => {
    const cart = req.body;
    cart.userId = req.id;
    try {
        const newCart = await cartModel.create(cart);
        res.status(201).json({
            message: "Cart created successfully",
            data: newCart,
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const getCart = async (req, res) => {
    const userId = req.id;

    try {
        const userCart = await cartModel.find({ userId });
        res.status(201).json({
            userId,
            message: "Cart fetched successfully",
            data: userCart,
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
const updateCart = async (req, res) => {
    const userId = req.id;
    const newProduct = req.body;

    try {
        const updateCart = await cartModel.updateOne(
            { userId },
            { $push: { items: newProduct } }
        );

        res.status(201).json({
            userId,
            message: "Cart update successfully",
            data: updateCart,
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
const deleteProductFromCart = async (req, res) => {
    const userId = req.id;
    const productId = req.body.productId;
    try {
        const findCart = await cartModel.find({ userId });
        console.log(findCart);
        const filteredProducts = findCart[0].items.filter(
            (product) => product.productId.toString() !== productId
        );
        const updateCart = await cartModel.updateOne(
            { userId },
            { items: filteredProducts }
        );
        res.status(201).json({
            userId,
            message: "product deleted successfully",
            data: updateCart,
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
module.exports = { addNewCart, getCart, updateCart, deleteProductFromCart };

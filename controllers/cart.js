const cartModel = require("../models/cart");

const addNewCart = async (req, res) => {
    const { productId } = req.body;
    const userId = req.id;
    let cartItems = { userId: userId, items: [{ productId: productId }] };
    // console.log(req.id);
    let cart = await cartModel.findOne({ userId: userId });
    try {
        if (!cart) {
            const newCart = await cartModel.create(cartItems);
            res.status(201).json({
                userId,
                message: "Cart created successfully",
                data: newCart,
            });
        } else {
            // console.log(cart.items);
            const productIndex = cart.items.findIndex(
                (item) => item.productId.toString() === productId
            );
            if (productIndex > -1) {
                const cartItem = cart.items[productIndex];
                cartItem.quantity += 1;
                cart.items[productIndex] = cartItem;
            } else {
                // product not exist in cart,  push product to cartItems array
                cart.items.push({
                    productId: productId,
                });
            }
            await cart.save();
            res.status(201).json({
                userId,
                message: "Cart update successfully",
                data: cart,
                numOfCartItems: cart.items.length,
            });
        }
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
// const updateCart = async (req, res) => {
//     const userId = req.id;
//     const newProduct = req.body;

//     try {
//         const updateCart = await cartModel.updateOne(
//             { userId },
//             { $push: { items: newProduct } }
//         );

//         res.status(201).json({
//             userId,
//             message: "Cart update successfully",
//             data: updateCart,
//         });
//     } catch (error) {
//         res.status(400).json({ message: error.message });
//     }
// };
const deleteProductFromCart = async (req, res) => {
    const userId = req.id;
    const productId = req.body.productId;
    try {
        const findCart = await cartModel.findOne({ userId: userId });
        // console.log(findCart);
        const filteredProducts = findCart.items.filter(
            (product) => product.productId.toString() !== productId
        );
        const updateCart = await cartModel.updateOne(
            { userId },
            { items: filteredProducts }
        );
        res.status(201).json({
            userId,
            message: "product deleted successfully",
            // data: updateCart,
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
module.exports = { addNewCart, getCart, deleteProductFromCart };

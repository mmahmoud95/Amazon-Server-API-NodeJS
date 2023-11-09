const cartModel = require("../models/cart");
const Product = require("../models/product");

const calcTotalCartPrice = (cart) => {
    let totalPrice = 0;
    cart.items.forEach((item) => {
        totalPrice += item.quantity * item.price;
    });
    cart.totalPrice = totalPrice;
    // cart.totalPriceAfterDiscount = undefined;
    return totalPrice;
};
const addNewCart = async (req, res) => {
    const { productId } = req.body;
    const userId = req.id;
    const product = await Product.findById(productId);

    let cartItems = {
        userId: userId,
        items: [{ productId: productId, price: product.price }],
    };
    // console.log(req.id);
    let cart = await cartModel.findOne({ userId: userId });
    try {
        if (!cart) {
            const newCart = await cartModel.create(cartItems);
            calcTotalCartPrice(cart);
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
            calcTotalCartPrice(cart);
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
        const userCart = await cartModel.findOne({ userId: userId });
        // console.log(userCart),
        res.status(201).json({
            userId,
            message: "Cart fetched successfully",
            data: userCart,
            price: userCart.price,
            numOfCartItems: userCart.items.length,
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
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
        calcTotalCartPrice(updateCart);

        res.status(201).json({
            userId,
            message: "product deleted successfully",
            data: updateCart,
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
// @desc    Update specific cart item quantity
// @route   PUT /api/v1/cart/:itemId
// @access  Private/User
const updateCartItemQuantity = async (req, res, next) => {
    const { quantity } = req.body;
    const userId = req.id;

    const cart = await cartModel.findOne({ userId: userId });

    const itemIndex = cart.items.findIndex(
        (item) => item._id.toString() === req.params.itemId
    );
    const items = cart.items[itemIndex];
    items.quantity = quantity;
    cart.items[itemIndex] = items;

    calcTotalCartPrice(cart);

    await cart.save();

    res.status(200).json({
        status: "success",
        numOfCartItems: cart.items.length,
        data: cart,
    });
};
module.exports = {
    addNewCart,
    getCart,
    deleteProductFromCart,
    updateCartItemQuantity,
};

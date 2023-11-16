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
    const itemsToAdd = req.body.items; // Assuming the request body contains an array of items [{ productId, quantity }, ...]
    const userId = req.id;

    try {
        let cart = await cartModel.findOne({ userId: userId });

        if (!cart) {
            const newCartItems = [];

            for (const item of itemsToAdd) {
                const product = await Product.findById(item.productId);
                newCartItems.push({
                    productId: item.productId,
                    price: product.price,
                    quantity: item.quantity,
                });
            }

            const newCart = await cartModel.create({
                userId: userId,
                items: newCartItems,
                totalPrice: calculateTotalPrice(newCartItems),
            });

            calcTotalCartPrice(newCart);
            return res.status(201).json({
                userId,
                message: "Cart created successfully",
                data: newCart,
            });
        } else {
            // If the cart exists, update it with the provided items
            for (const item of itemsToAdd) {
                const productIndex = cart.items.findIndex(
                    (cartItem) =>
                        cartItem.productId.toString() === item.productId
                );

                if (productIndex > -1) {
                    // If the item exists in the cart, update its quantity
                    cart.items[productIndex].quantity += item.quantity;
                } else {
                    // If the item doesn't exist, add it to the cart
                    const product = await Product.findById(item.productId);
                    cart.items.push({
                        productId: item.productId,
                        price: product.price,
                        quantity: item.quantity,
                    });
                }
            }

            calcTotalCartPrice(cart);
            await cart.save();

            return res.status(201).json({
                userId,
                message: "Cart updated successfully",
                data: cart,
                // numOfCartItems: cart.items.length,
            });
        }
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};

// Calculate total price based on items
const calculateTotalPrice = (items) => {
    return items.reduce((total, item) => {
        return total + item.price * item.quantity;
    }, 0);
};

// const addNewCart = async (req, res) => {
//     const { productId } = req.body;
//     const { quantity } = req.body;
//     const userId = req.id;
//     const product = await Product.findById(productId);
//     let cartItems = {
//         userId: userId,
//         items: [
//             { productId: productId, price: product.price, quantity: quantity },
//         ],
//     };
//     let cart = await cartModel.findOne({ userId: userId });
//     try {
//         if (!cart) {
//             const newCart = await cartModel.create({
//                 ...cartItems,
//                 totalPrice: product.price * quantity,
//             });
//             calcTotalCartPrice(newCart);
//             res.status(201).json({
//                 userId,
//                 message: "Cart created successfully",
//                 data: newCart,
//             });
//         } else {
//             const productIndex = cart.items.findIndex(
//                 (item) => item.productId.toString() === productId
//             );
//             if (productIndex > -1) {
//                 const cartItem = cart.items[productIndex];
//                 cartItem.quantity += quantity;
//                 cart.items[productIndex] = cartItem;
//             } else {
//                 cart.items.push({
//                     productId: productId,
//                     price: product.price,
//                     quantity: quantity,
//                 });
//             }
//             calcTotalCartPrice(cart);

//             await cartModel.updateOne(
//                 { userId: userId },
//                 { $set: { items: cart.items, totalPrice: cart.totalPrice } }
//             );

//             res.status(201).json({
//                 userId,
//                 message: "Cart update successfully",
//                 data: cart,
//                 numOfCartItems: cart.items.length,
//             });
//         }
//     } catch (error) {
//         res.status(400).json({ message: error.message });
//     }
// };

// const addNewCart = async (req, res) => {
//     try {
//         const { productId } = req.body;
//         const userId = req.id;
//         const product = await Product.findById(productId);

//         const cartItems = {
//             userId: userId,
//             items: [
//                 { productId: productId, price: product.price, quantity: 1 },
//             ],
//         };

//         let cart = await cartModel.findOne({ userId: userId });

//         if (!cart) {
//             const newCart = await createNewCart(userId, cartItems);
//             return res.status(201).json({
//                 userId,
//                 message: "Cart created successfully",
//                 data: newCart,
//                 numOfCartItems: newCart.items.length,
//             });
//         } else {
//             updateCart(cart, productId, product.price);
//             return res.status(201).json({
//                 userId,
//                 message: "Cart updated successfully",
//                 data: cart,
//                 numOfCartItems: cart.items.length,
//             });
//         }
//     } catch (error) {
//         console.error("Error adding/updating cart:", error);
//         res.status(500).json({ message: "Internal server error" });
//     }
// };

// const createNewCart = async (userId, cartItems) => {
//     const newCart = await cartModel.create({
//         ...cartItems,
//         totalPrice: cartItems.items[0].price,
//     });
//     return newCart;
// };

// const updateCart = (cart, productId, productPrice) => {
//     const productIndex = cart.items.findIndex(
//         (item) => item.productId.toString() === productId
//     );

//     if (productIndex > -1) {
//         const cartItem = cart.items[productIndex];
//         cartItem.quantity += 1;
//         cart.items[productIndex] = cartItem;
//     } else {
//         cart.items.push({
//             productId: productId,
//             price: productPrice,
//             quantity: 1,
//         });
//     }

//     cart.totalPrice = calculateTotalPrice(cart.items);
//     cart.save();
// };

// const calculateTotalPrice = (items) => {
//     return items.reduce((total, item) => total + item.quantity * item.price, 0);
// };

const getCart = async (req, res) => {
    const userId = req.id;
    try {
        const userCart = await cartModel
            .findOne({ userId: userId })
            .populate({ path: "items.productId", model: "Product" });
        // console.log(userCart),
        res.status(201).json({
            userId,
            message: "Cart fetched successfully",
            data: userCart,
            // price: userCart.price,
            numOfCartItems: userCart.items.length,
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
// const deleteProductFromCart = async (req, res) => {
//     const userId = req.id;
//     const productId = req.params.productId;
//     try {
//         const findCart = await cartModel.findOne({ userId: userId });
//         // console.log(findCart);
//         const filteredProducts = findCart.items.filter(
//             (product) => product.productId.toString() !== productId
//         );
//         const updateCart = await cartModel.updateOne(
//             { userId },
//             { items: filteredProducts }
//         );
//         calcTotalCartPrice(updateCart);
//         res.status(201).json({
//             userId,
//             message: "product deleted successfully",
//             data: updateCart,
//         });
//     } catch (error) {
//         res.status(400).json({ message: error.message });
//     }
// };

const deleteProductFromCart = async (req, res) => {
    const cart = await cartModel
        .findOneAndUpdate(
            { userId: req.id },
            {
                $pull: { items: { productId: req.params.productId } },
            },
            { new: true }
        )
        .populate({
            path: "items.productId",
            model: "Product", // Replace 'Product' with the actual name of your product model
            // select: "productName price", // Select the fields you want to populate in the product
        });

    calcTotalCartPrice(cart);
    cart.save();

    res.status(200).json({
        status: "success",
        numOfCartItems: cart.items.length,
        data: cart,
    });
};
// @desc    Update specific cart item quantity
// @route   PUT /api/v1/cart/:itemId
// @access  Private/User
const updateCartItemQuantity = async (req, res, next) => {
    const { quantity } = req.body;
    const { productId } = req.body;
    const userId = req.id;

    const cart = await cartModel.findOne({ userId: userId });

    const itemIndex = cart.items.findIndex(
        (item) => item.productId.toString() === productId
    );
    const items = cart.items[itemIndex];
    items.quantity = quantity;
    cart.items[itemIndex] = items;

    calcTotalCartPrice(cart);

    await cart.save();

    res.status(200).json({
        status: "success",
        // numOfCartItems: cart.items.length,
        data: cart,
    });
};
module.exports = {
    addNewCart,
    getCart,
    deleteProductFromCart,
    updateCartItemQuantity,
};

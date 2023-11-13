const express = require("express");
var router = express.Router();
const { auth } = require("../middlewares/userAuth");

const {
    addNewCart,
    getCart,
    deleteProductFromCart,
    updateCartItemQuantity,
} = require("../controllers/cart");

router.post("/", auth, addNewCart);
router.get("/", auth, getCart);
router.patch("/", auth, updateCartItemQuantity);
router.delete("/:productId", auth, deleteProductFromCart);

module.exports = router;

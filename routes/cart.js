const express = require("express");
var router = express.Router();
const { auth } = require("../middlewares/userAuth");

const {
    addNewCart,
    getCart,
    deleteProductFromCart,
} = require("../controllers/cart");

router.post("/", auth, addNewCart);
router.get("/", auth, getCart);
router.delete("/", auth, deleteProductFromCart);

module.exports = router;

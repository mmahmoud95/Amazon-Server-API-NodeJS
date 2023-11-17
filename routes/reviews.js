const express = require("express");
var router = express.Router();
const { auth } = require("../middlewares/userAuth");

const { addNewReview, getReviews } = require("../controllers/reviews");

router.post("/", auth, addNewReview);
router.get("/:productId", getReviews);
// router.patch("/", auth, updateCartItemQuantity);
// router.delete("/:productId", auth, deleteProductFromCart);

module.exports = router;

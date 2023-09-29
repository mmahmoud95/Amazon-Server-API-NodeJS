const express = require("express");
var router = express.Router();
const { auth } = require("../middlewares/userAuth");
const { authRole } = require("../middlewares/adminAuth");

const {
    addNewProduct,
    getAllProduct,
    deleteAllProducts,
    getProductById,
    updateProductByID,
    deletProductByID,
} = require("../controllers/product");

router.post("/", auth,authRole,addNewProduct);
router.get("/", getAllProduct);
router.get("/:id", getProductById);
router.patch("/:id", auth, authRole, updateProductByID);
router.delete("/:id", auth, authRole, deletProductByID);
router.delete("/", auth, authRole, deleteAllProducts);

module.exports = router;

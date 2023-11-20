const express = require("express");
var router = express.Router();
const { auth } = require("../middlewares/userAuth");
const { authRole } = require("../middlewares/adminAuth");

const {
    addNewProduct,
    getAllProduct,
    getFilteredProducts,
    deleteAllProducts,
    getProductById,
    updateProductByID,
    deletProductByID,
    getProductsByCategory,
    filterWithPrice,
    filterByRating,
    filterByBrand,
    queryfilterPrdSubSub,
    queryfilterPrdOfCategory,
    queryfilterPrdOfSubCategory,
    getProductByIdForDashboard
} = require("../controllers/product");

router.post("/", addNewProduct);
router.post("/result", getFilteredProducts);
// router.get("/", getAllProduct);
router.get("/:id", getProductById);
router.get("/admin/:id",getProductByIdForDashboard);
router.get("/category/:category", getProductsByCategory);
router.patch("/:id",  updateProductByID);
router.delete("/", auth, authRole, deleteAllProducts);
router.delete("/:id", auth, authRole, deletProductByID);
router.get('/filterByPrice/:price',filterWithPrice)
router.get('/filterByRating/:rating',filterByRating)
router.get('/filterByBrand/:brand',filterByBrand)
router.get('/subSubCategory/:subSubCategory',queryfilterPrdSubSub)
router.get('/categoryPrd/:categoryId',queryfilterPrdOfCategory)
router.get('/subCategoryPrd/:subCategoryId',queryfilterPrdOfSubCategory)

module.exports = router;

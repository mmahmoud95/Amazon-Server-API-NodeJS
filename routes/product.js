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
    getProductByIdForDashboard ,
    createProduct,
    getProductsByAdmin,
    deleteProductByAdmin,
} = require("../controllers/product");

router.post("/",auth, authRole, addNewProduct);
router.post("/result", getFilteredProducts);
router.get("/all", getAllProduct);
// router.get("/adminProducts", auth, authRole,getProductsByAdmin);

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
// router.use(auth);

router.post("/addbyAd", auth, authRole, createProduct);

// GET /products - Only admin can get their products
// router.get("/", auth, authRole, getProductsByAdmin);

// DELETE /products/:productId - Only admin can delete their product
// router.delete("/:productId", auth, authRole, deleteProductByAdmin);



module.exports = router;

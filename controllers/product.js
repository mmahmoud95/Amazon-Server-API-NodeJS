const { log } = require("console");
const productModel = require("../models/product");

const addNewProduct = async (req, res) => {
  const product = req.body;
  log(product, "gggggg");
  try {
    const newProduct = await productModel.create(product);
    res.status(201).json({
      message: "Product Added successfully",
      data: newProduct,
    });
  } catch (error) {
    log(error);
    res.status(400).json({ message: error.message });
  }
};

const getAllProduct = async (req, res) => {
  try {
    const products = await productModel
      .find()
      .populate("category", "name")
      .populate("subCategory", "name")
      .populate("subSubCategor", "name");
    res.status(200).json({
      message: "Products fetched successfully",
      data: products,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
  try {
    const products = await productModel
      .find()
      .populate("category", "name")
      .populate("subCategory", "name")
      .populate("subSubCategor", "name");
    res.status(200).json({
      message: "Products fetched successfully",
      data: products,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
const getFilteredProducts = async (req, res) => {
  const { search } = req.query;
  console.log(search, "search value");
  const category = req.body.category;
  const lang = req.body.lang;
  console.log(category, "selected", lang);
  if (search) {
    try {
      if (lang === "en") {
        if (category === "All") {
          console.log("inside if");
          const products = await productModel.find({
            "en.title": { $regex: search, $options: "i" },
          });
          console.log("after find data", products);
          if (products.length > 0) {
            res.status(200).json({
              message: "Products fetched successfully",
              data: products,
            });
          }else{
            res.status(200).json({ message: "not found" ,data: products});

          }
          
        } else if (category !== "All" ) {
          const products = await productModel.find({
            category: category,
            "en.title": { $regex: search, $options: "i" },
          });
          if (products.length > 0) {
            res.status(200).json({
              message: "Products fetched successfully",
              data: products,
            });
          }else{
            res.status(200).json({ message: "not found" ,data: products});

          }
        }
      } else if (category === "All" && lang === "ar") {
        const products = await productModel.find({
          "ar.title": { $regex: new RegExp(search, "iu") },
        });
        if (products.length > 0) {
          res.status(200).json({
            message: "Products fetched successfully",
            data: products,
          });
        } else {
          res.status(200).json({
            message: "no products match your search",
            data: products,
          });
        }
      } else if (category !== "All" && lang === "ar") {
        const products = await productModel.find({
          category: category,
          "ar.title": { $regex: new RegExp(search, "iu") },
        });
        if (products.length > 0) {
          res.status(200).json({
            message: "Products fetched successfully",
            data: products,
          });
        } else {
          res.status(200).json({
            message: "no products match your search",
            data: products,
          });
        }
      }
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  } else {
    res.status(404).json({ message: "not found" });
  }
};
const getProductById = async (req, res) => {
  const id = req.params.id;
  try {
    const product = await productModel
      .findById(id)
      .populate("category", ["ar", "en"]);

    res.status(200).json({
      message: "Product fetched successfully",
      data: product,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
const getProductByIdForDashboard = async (req, res) => {
  const id = req.params.id;
  console.log(id);
  try {
    const product = await productModel.findById(id);

    res.status(200).json({
      message: "Product fetched successfully",
      data: product,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
// update product by id
const updateProductByID = async (req, res) => {
  const id = req.params.id;
  console.log(req.body);
  const english = req.body.en;
  const arabic = req.body.ar;

  const {
    thumbnail,
    quantityInStock,
    price,
    category,
    subCategory,
    subSubCategor,
    images,
  } = req.body;
  try {
    const product = await productModel.findByIdAndUpdate(id, {
      en: english,
      ar: arabic,
      thumbnail,
      images,
      quantityInStock,
      price,
      category,
      subCategory,
      subSubCategor,
    });
    res.status(200).json({
      message: "Product updated successfully",
      data: product,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
const deletProductByID = async (req, res) => {
  const id = req.params.id;
  try {
    const product = await productModel.findByIdAndDelete(id);
    res.status(200).json({
      message: "Product deleted successfully",
      data: product,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
const deleteAllProducts = async (req, res) => {
  try {
    await productModel.deleteMany({});

    res.status(200).json({ message: "Products deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
const getProductsByCategory = async (req, res) => {
  const category = req.params.category;
  try {
    const products = await productModel
      .find({
        $or: [
          { category: category },
          { subCategory: category },
          { subSubCategor: category },
        ],
      })
      .populate("category", "name");
    if (products.length !== 0) {
      res.status(200).json({
        message: "Product fetched successfully",
        data: products,
      });
    } else {
      res.status(404).json({
        message: "no data",
      });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

//filter products by price :
const filterWithPrice = async (req, res) => {
  try {
    const filteredProducts = await productModel.find({
      price: req.params.price,
    });
    res.status(201).json(filteredProducts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//filter by rating:
const filterByRating = async (req, res) => {
  try {
    const FoundProducts = await productModel.find({
      rating: req.params.rating,
    });
    res.status(201).json(FoundProducts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// filter by brand
const filterByBrand = async (req, res) => {
  try {
    const brandProducts = await productModel.find({
      brand: req.params.brand,
    });
    res.status(201).json(brandProducts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// filtering products of specific category by query string:
const queryfilterPrdOfCategory = async (req, res) => {
  //filtering
  console.log(req.query);
  const queryObj = { ...req.query };
  console.log(queryObj);
  const queryFields = ["page", "limit", "skip"];
  queryFields.forEach((field) => delete queryObj[field]);
  console.log(queryFields);

  //converting {gte,gt,lt,lte} to {$gte, $gt, $lt, $lte}
  let queryStr = JSON.stringify(queryObj);
  console.log(queryStr);
  //regEx: "\b \b" means the same word with exact letters (not a piece of word) ,
  //"g" means any count of this words
  queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (match) => `$${match}`);
  //pagination
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1;
  const skip = (page - 1) * limit || req.query.skip;

  try {
    const products = await productModel
      .find(JSON.parse(queryStr))
      .where("category")
      .equals(req.params.categoryId)
      .skip(skip)
      .limit(limit)
      .populate("category", "name");
    if (products.length !== 0) {
      res.status(200).json({
        message: "Product fetched successfully",
        results: products.length,
        page,
        data: products,
      });
    } else {
      res.status(404).json({
        message: "no data",
      });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// filtering products of specific subcategory by query string:
const queryfilterPrdOfSubCategory = async (req, res) => {
  //filtering
  console.log(req.query);
  const queryObj = { ...req.query };
  console.log(queryObj);
  const queryFields = ["page", "limit", "skip"];
  queryFields.forEach((field) => delete queryObj[field]);
  console.log(queryFields);

  //converting {gte,gt,lt,lte} to {$gte, $gt, $lt, $lte}
  let queryStr = JSON.stringify(queryObj);
  console.log(queryStr);
  //regEx: "\b \b" means the same word with exact letters (not a piece of word) ,
  //"g" means any count of this words
  queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (match) => `$${match}`);
  //pagination
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 20;
  const skip = (page - 1) * limit || req.query.skip;

  try {
    const products = await productModel
      .find(JSON.parse(queryStr))
      .where("subCategory")
      .equals(req.params.subCategoryId)
      .skip(skip)
      .limit(limit)
      .populate("category", "name");
    if (products.length !== 0) {
      res.status(200).json({
        message: "Product fetched successfully",
        results: products.length,
        page,
        data: products,
      });
    } else {
      res.status(404).json({
        message: "no data",
      });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// filtering products of sub_sub category by query string:
const queryfilterPrdSubSub = async (req, res) => {
  //filtering
  console.log(req.query);
  const queryObj = { ...req.query };
  console.log(queryObj);
  const queryFields = ["page", "limit", "skip"];
  queryFields.forEach((field) => delete queryObj[field]);
  console.log(queryFields);

  //converting {gte,gt,lt,lte} to {$gte, $gt, $lt, $lte}
  let queryStr = JSON.stringify(queryObj);
  console.log(queryStr);
  //regEx: "\b \b" means the same word with exact letters (not a piece of word) ,
  //"g" means any count of this words
  queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (match) => `$${match}`);
  //pagination
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 20;
  const skip = (page - 1) * limit || req.query.skip;

  try {
    const products = await productModel
      .find(JSON.parse(queryStr))
      .where("subSubCategor")
      .equals(req.params.subSubCategory)
      .skip(skip)
      .limit(limit)
      .populate("category", "name");
    if (products.length !== 0) {
      res.status(200).json({
        message: "Product fetched successfully",
        results: products.length,
        page,
        data: products,
      });
    } else {
      res.status(404).json({
        message: "no data",
      });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  addNewProduct,
  getAllProduct,
  getProductByIdForDashboard,
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
};

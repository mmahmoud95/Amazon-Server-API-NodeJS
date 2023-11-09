const productModel = require("../models/product");

const addNewProduct = async (req, res) => {
  const product = req.body;
  try {
    const newProduct = await productModel.create(product);
    res.status(201).json({
      message: "Product Added successfully",
      data: newProduct,
    });
  } catch (error) {
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
};
const getFilteredProducts = async (req, res) => {
  const { search } = req.query;

  if (search) {
    try {
      const products = await productModel.find({
        title: { $regex: search, $options: "i" },
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
      .populate("category", "name");
    res.status(200).json({
      message: "Product fetched successfully",
      data: product,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateProductByID = async (req, res) => {
  const id = req.params.id;
  const { title } = req.body;
  const { descreption } = req.body;
  const { imageUrl } = req.body;
  const { quantity } = req.body;
  const { price } = req.body;
  const { category } = req.body;

  try {
    const product = await productModel.findByIdAndUpdate(id, {
      title,
      descreption,
      imageUrl,
      quantity,
      price,
      category,
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
      .find({ category: category })
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
    const brandProducts = await productModel.find({ brand: req.params.brand });
    res.status(201).json(brandProducts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// filtering products of sub_sub category by query string:
const queryfilterPrdSubSub = async (req, res) => {
    //filtering
    console.log(req.query);
  const queryObj = { ...req.query };
  console.log(queryObj);
  const queryFields = ["page","limit","skip"];
  queryFields.forEach((field)=>delete queryObj[field]);
  console.log(queryFields);

  //converting {gte,gt,lt,lte} to {$gte, $gt, $lt, $lte}
let queryStr= JSON.stringify(queryObj)
console.log(queryStr);
//regEx: "\b \b" means the same word with exact letters (not a piece of word) ,
//"g" means any count of this words 
queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g ,(match)=>`$${match}`)
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
};

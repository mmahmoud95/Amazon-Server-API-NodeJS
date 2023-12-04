const {log} = require("console");
const productModel = require("../models/product");

const addNewProduct = async (req, res) => {
	const product = req.body;
	// log(product, "gggggg");
	try {
		const newProduct = await productModel.create(product);
		res.status(201).json({
			message: "Product Added successfully",
			data: newProduct,
		});
	} catch (error) {
		// log(error);
		res.status(400).json({message: error.message});
	}
};

const getAllProductForAdmin = async (req, res) => {
	const {id} = req;
	try {
		const products = await productModel.find({createdBy: id});
		res.status(200).json({
			message: "Products fetched successfully",
			data: products,
		});
	} catch (error) {
		res.status(400).json({message: error.message});
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
		res.status(400).json({message: error.message});
	}
};
const getFilteredProducts = async (req, res) => {
	const {search} = req.query;
	// console.log(search, "search value");
	const category = req.body.category;
	const lang = req.body.lang;
	// console.log(category, "selected", lang);
	if (search) {
		try {
			if (lang === "en") {
				if (category === "All") {
					const products = await productModel.find({
						"en.title": {$regex: search, $options: "i"},
					});
					if (products.length > 0) {
						res.status(200).json({
							message: "Products fetched successfully",
							data: products,
						});
					} else {
						res.status(200).json({
							message: "not found",
							data: products,
						});
					}
				} else if (category !== "All") {
					const products = await productModel.find({
						category: category,
						"en.title": {$regex: search, $options: "i"},
					});
					if (products.length > 0) {
						res.status(200).json({
							message: "Products fetched successfully",
							data: products,
						});
					} else {
						res.status(200).json({
							message: "not found",
							data: products,
						});
					}
				}
			} else if (category === "All" && lang === "ar") {
				const products = await productModel.find({
					"ar.title": {$regex: new RegExp(search, "iu")},
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
					"ar.title": {$regex: new RegExp(search, "iu")},
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
			res.status(400).json({message: error.message, data: []});
		}
	} else {
		res.status(200).json({message: "not found"});
	}
};
const getProductById = async (req, res) => {
	const id = req.params.id;
	try {
		const product = await productModel
			.findById(id)
			.populate("category", ["ar", "en"]).populate("createdBy").populate("subSubCategor",["ar", "en"])

		res.status(200).json({
			message: "Product fetched successfully",
			data: product,
		});
	} catch (error) {
		res.status(400).json({message: error.message});
	}
};
const getProductByIdForDashboard = async (req, res) => {
	const id = req.params.id;
	try {
		const product = await productModel.findById(id);

		res.status(200).json({
			message: "Product fetched successfully",
			data: product,
		});
	} catch (error) {
		res.status(400).json({message: error.message});
	}
};
// update product by id
const updateProductByID = async (req, res) => {
	const id = req.params.id;
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
		res.status(400).json({message: error.message});
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
		res.status(400).json({message: error.message});
	}
};
const deleteAllProducts = async (req, res) => {
	try {
		await productModel.deleteMany({});

		res.status(200).json({message: "Products deleted successfully"});
	} catch (error) {
		res.status(400).json({message: error.message});
	}
};
const getProductsByCategory = async (req, res) => {
	const category = req.params.category;
	try {
		const products = await productModel
			.find({
				$or: [
					{category: category},
					{subCategory: category},
					{subSubCategor: category},
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
		res.status(400).json({message: error.message});
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
		res.status(500).json({message: error.message});
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
		res.status(500).json({message: error.message});
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
		res.status(500).json({message: error.message});
	}
};

// filtering products of specific category by query string:
const queryfilterPrdOfCategory = async (req, res) => {
	//filtering
	//   console.log(req.query);
	const queryObj = {...req.query};
	console.log(queryObj);
	const queryFields = ["page", "limit", "skip", "sort"];
	queryFields.forEach((field) => delete queryObj[field]);
	//   console.log(queryFields);

	//converting {gte,gt,lt,lte} to {$gte, $gt, $lt, $lte}
	let queryStr = JSON.stringify(queryObj);
	//   console.log(queryStr);
	//regEx: "\b \b" means the same word with exact letters (not a piece of word) ,
	//"g" means any count of this words
	queryStr = queryStr.replace(
		/\b(gt|gte|lt|lte)\b/g,
		(match) => `$${match}`
	);
	//pagination
	const page = req.query.page * 1 || 1;
	console.log(page, "pageeeee");
	const limit = req.query.limit * 1 || 20;
	console.log(limit, "limittt");
	const skip = (page - 1) * limit * 1 || req.query.skip;
	console.log(skip, "skippppppp");
	const endIndex = page * limit;

	let documentCount = await productModel
		.countDocuments(JSON.parse(queryStr))
		.where("category")
		.equals(req.params.categoryId);
	console.log(documentCount, "documentCount");

	const pagination = {};
	pagination.currentPage = page;
	pagination.limit = limit;
	pagination.skip = skip * 1;
	pagination.numberOfPages = Math.ceil(documentCount / limit);
	//next page
	if (endIndex < documentCount) {
		pagination.next = page + 1;
	}
	//previous page
	if (skip > 0) {
		pagination.prev = page - 1;
	}
	console.log(pagination, "pagination");

	try {
		const products = await productModel
			.find(JSON.parse(queryStr))
			.where("category")
			.equals(req.params.categoryId)
			.skip(skip)
			.limit(limit)
			.populate("category", "name")
			.sort(
				req.query.sort
					? req.query.sort.split(",").join(" ")
					: {createdAt: -1}
			);
		if (products.length !== 0) {
			res.status(200).json({
				message: "Product fetched successfully",
				results: documentCount,
				pagination: pagination,
				page,
				data: products,
			});
		} else {
			res.status(404).json({
				message: "no data",
			});
		}
	} catch (error) {
		res.status(400).json({message: error.message});
	}
};

// filtering products of specific subcategory by query string:
const queryfilterPrdOfSubCategory = async (req, res) => {
	//filtering
	console.log(req.query);
	const queryObj = {...req.query};
	console.log(queryObj);
	const queryFields = ["page", "limit", "skip", "sort"];
	queryFields.forEach((field) => delete queryObj[field]);
	console.log(queryFields);

	//converting {gte,gt,lt,lte} to {$gte, $gt, $lt, $lte}
	let queryStr = JSON.stringify(queryObj);
	console.log(queryStr);
	//regEx: "\b \b" means the same word with exact letters (not a piece of word) ,
	//"g" means any count of this words
	queryStr = queryStr.replace(
		/\b(gt|gte|lt|lte)\b/g,
		(match) => `$${match}`
	);
	//pagination
	const page = req.query.page * 1 || 1;
	const limit = req.query.limit * 1 || 20;
	const skip = (page - 1) * limit * 1 || req.query.skip;
	const endIndex = page * limit;

	let documentCount = await productModel
		.countDocuments(JSON.parse(queryStr))
		.where("subCategory")
		.equals(req.params.subCategoryId);
	console.log(documentCount, "documentCount");

	const pagination = {};
	pagination.currentPage = page;
	pagination.limit = limit;
	pagination.skip = skip * 1;
	pagination.numberOfPages = Math.ceil(documentCount / limit);
	//next page
	if (endIndex < documentCount) {
		pagination.next = page + 1;
	}
	//previous page
	if (skip > 0) {
		pagination.prev = page - 1;
	}
	console.log(pagination, "pagination");

	try {
		const products = await productModel
			.find(JSON.parse(queryStr))
			.where("subCategory")
			.equals(req.params.subCategoryId)
			.skip(skip)
			.limit(limit)
			.populate("category", "name")
			.sort(
				req.query.sort
					? req.query.sort.split(",").join(" ")
					: {createdAt: -1}
			);
		if (products.length !== 0) {
			res.status(200).json({
				message: "Product fetched successfully",
				results: products.length,
				pagination: pagination,
				page,
				data: products,
			});
		} else {
			res.status(404).json({
				message: "no data",
			});
		}
	} catch (error) {
		res.status(400).json({message: error.message});
	}
};

// filtering products of sub_sub category by query string:
const queryfilterPrdSubSub = async (req, res) => {
	//filtering
	console.log(req.query);
	const queryObj = {...req.query};
	console.log(queryObj);
	const queryFields = ["page", "limit", "skip", "sort"];
	queryFields.forEach((field) => delete queryObj[field]);
	console.log(queryFields);

	//converting {gte,gt,lt,lte} to {$gte, $gt, $lt, $lte}
	let queryStr = JSON.stringify(queryObj);
	console.log(queryStr);
	//regEx: "\b \b" means the same word with exact letters (not a piece of word) ,
	//"g" means any count of this words
	queryStr = queryStr.replace(
		/\b(gt|gte|lt|lte)\b/g,
		(match) => `$${match}`
	);
	//pagination
	const page = req.query.page * 1 || 1;
	const limit = req.query.limit * 1 || 20;
	const skip = (page - 1) * limit * 1 || req.query.skip;
	const endIndex = page * limit;

	let documentCount = await productModel
		.countDocuments(JSON.parse(queryStr))
		.where("subSubCategor")
		.equals(req.params.subSubCategory);
	console.log(documentCount, "documentCount");

	const pagination = {};
	pagination.currentPage = page;
	pagination.limit = limit;
	pagination.skip = skip * 1;
	pagination.numberOfPages = Math.ceil(documentCount / limit);
	//next page
	if (endIndex < documentCount) {
		pagination.next = page + 1;
	}
	//previous page
	if (skip > 0) {
		pagination.prev = page - 1;
	}
	console.log(pagination, "pagination");

	try {
		const products = await productModel
			.find(JSON.parse(queryStr))
			.where("subSubCategor")
			.equals(req.params.subSubCategory)
			.skip(skip)
			.limit(limit)
			.populate("category", "name")
			.sort(
				req.query.sort
					? req.query.sort.split(",").join(" ")
					: {createdAt: -1}
			);
		if (products.length !== 0) {
			res.status(200).json({
				message: "Product fetched successfully",
				results: products.length,
				pagination: pagination,
				page,
				data: products,
			});
		} else {
			res.status(404).json({
				message: "no data",
			});
		}
	} catch (error) {
		res.status(400).json({message: error.message});
	}
};

////////////////////////////////////
const Product = require("../models/product");

// Controller function to create a product for a specific admin
const createProduct = async (req, res) => {
	try {
		const user = req.id;

		// Check if the user is an admin
		// if (user.userType !== 'admin') {
		//     return res.status(403).json({ message: "Access denied. User is not an admin." });
		// }

		const product = new Product({
			...req.body,
			createdBy: user,
		});
		console.log(product);
		const savedProduct = await product.save();
		res.json(savedProduct);
	} catch (error) {
		res.status(400).json({message: error.message});
	}
};

// Controller function to get products for a specific admin
const getProductsByAdmin = async (req, res) => {
	try {
		const {user} = req;

		// Check if the user is an admin
		if (user.userType !== "admin") {
			return res.status(403).json({
				message: "Access denied. User is not an admin.",
			});
		}

		const products = await Product.find({createdBy: user._id});
		res.json(products);
	} catch (error) {
		res.status(500).json({message: error.message});
	}
};

// Controller function to delete a product for a specific admin
const deleteProductByAdmin = async (req, res) => {
	try {
		const {user} = req;
		const {productId} = req.params;

		// Check if the user is an admin
		if (user.userType !== "admin") {
			return res.status(403).json({
				message: "Access denied. User is not an admin.",
			});
		}

		const deletedProduct = await Product.findOneAndDelete({
			_id: productId,
			createdBy: user._id,
		});

		if (!deletedProduct) {
			return res.status(404).json({
				message: "Product not found or you don't have permission to delete it.",
			});
		}

		res.json(deletedProduct);
	} catch (error) {
		res.status(500).json({message: error.message});
	}
};
const getCountAllProduct = async (req, res) => {
	const {id} = req;
	try {
		const products = await productModel.find({createdBy: id});
		const count = products.length;
		res.status(200).json({count});
	} catch (error) {
		res.status(400).json({message: error.message});
	}
};
const getProductsRandom = async (req, res) => {
	const count = req.params.count;
	try {
		const products = await productModel
			.aggregate([
				{$sample: {size: +count}}, // Fetch 10 random documents
			])
			.exec();

		res.status(200).json({
			message: "Random products fetched successfully",
			data: products,
		});
	} catch (error) {
		res.status(400).json({message: error.message});
	}
};
// module.exports = {
//     createProduct,
//     getProductsByAdmin,
//     deleteProductByAdmin,
// };

//////////////////////////////////

module.exports = {
	createProduct,
	getProductsByAdmin,
	deleteProductByAdmin,
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
	getAllProductForAdmin,
	getCountAllProduct,
	getProductsRandom,
};

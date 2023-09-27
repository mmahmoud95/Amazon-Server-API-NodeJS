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
        const products = await productModel.find().populate("category", "name");
        res.status(200).json({
            message: "Products fetched successfully",
            data: products,
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
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

    try {
        const product = await productModel.findByIdAndUpdate(id, {
            title: title,
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

module.exports = {
    addNewProduct,
    getAllProduct,
    deleteAllProducts,
    getProductById,
    updateProductByID,
    deletProductByID,
};

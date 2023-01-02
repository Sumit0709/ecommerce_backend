const express = require("express");
const router = express.Router();

const { getProductById, getProduct, createProduct, photo, updateProduct, removeProduct, getAllProducts, getAllUniqueCategories } = require("../controllers/product");
const { isSignedIn, isAuthenticated, isAdmin } = require("../controllers/auth");
const { getUserById } = require("../controllers/user");

// create route
router.post("/product/create/:userId/", getUserById, isSignedIn, isAuthenticated, isAdmin, createProduct);

// read route
router.get("/product/:productId", getProductById, getProduct);
router.get("/product/photo/:productId", getProductById, photo);

//delete route
router.delete("/product/:productId/:userId", getUserById, isSignedIn, isAuthenticated, isAdmin, getProductById, removeProduct);

//update route
router.put("/product/:productId/:userId", getUserById, isSignedIn, isAuthenticated, isAdmin, getProductById, updateProduct);

// listing route
router.get("/products", getAllProducts);


//product categories
router.get("/products/categories", getAllUniqueCategories);

module.exports = router;
const express = require("express");
const router = express.Router();

const {
  getCategoryById,
  createCategory,
  getCategory,
  getAllCategory,
  updateCategory,
  removeCategory
} = require("../controllers/categogy");
const { isSignedIn, isAdmin, isAuthenticated } = require("../controllers/auth");
const { getUserById } = require("../controllers/user");

// params-> performing prequisits
//  router.use("/category/*/:userId", getUserById);
//  router.use("*/category/*/:categoryId", getCategoryById);



// creat routers
router.post(
  "/category/create/:userId",
  getUserById,
  isSignedIn,
  isAuthenticated,
  isAdmin,
  createCategory
);

// read routes
router.get("/category/:categoryId", getCategoryById, getCategory);
router.get("/categories", getAllCategory);

// update

router.put(
  "/category/:categoryId/:userId",
  getUserById,
  getCategoryById,
  isSignedIn,
  isAuthenticated,
  isAdmin,
  updateCategory
);

// delete
router.delete(
    "/category/:categoryId/:userId",
    getUserById,
    getCategoryById,
    isSignedIn,
    isAuthenticated,
    isAdmin,
    removeCategory
  );

module.exports = router;

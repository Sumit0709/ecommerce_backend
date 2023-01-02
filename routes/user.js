const express = require("express")
const router = express.Router();

// from controller
const { getUserById, getUser, updateUser, userPurchaseList } = require("../controllers/user");
const { isSignedIn, isAuthenticated, isAdmin} = require("../controllers/auth");

// router.param("/user/:userId",getUserById);

router.get("/user/:userId", getUserById, isSignedIn, isAuthenticated, getUser)

// update
router.put("/user/:userId", getUserById, isSignedIn, isAuthenticated, updateUser);
router.put("/orders/user/:userId", getUserById, isSignedIn, isAuthenticated, userPurchaseList);

module.exports = router;
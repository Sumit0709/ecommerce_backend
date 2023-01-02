const express = require('express')
const router = express.Router()
const  { signout, signup, signin, isSignedIn } = require("../controllers/auth");
const { body, validationResult } = require('express-validator');

// SIGNUP
router.post("/signup",
body("name").isLength({min:3}).withMessage("Username must be 3 chars long"),
body("email").isEmail().withMessage("Enter a valid email"),
body("password").isLength({min: 5}).withMessage("Password must be 5 chars long")
, signup);


// SIGNIN
router.post("/signin",
body("email").isEmail().withMessage("email is required"),
body("password").isLength({min: 5}).withMessage("password is required")
, signin);


router.get("/signout",signout);

// TEST

// router.get('/testroute', isSignedIn, (req, res)=>{
//     return res.json(req.auth);
// })

module.exports = router;
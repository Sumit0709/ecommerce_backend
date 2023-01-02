const User = require("../models/user");
const Order = require("../models/order");

exports.getUserById = (req, res, next) => {
    const userId = req.params.userId;
    
    User.findById(userId).exec((err, user)=>{
        if(err || !user){
            return res.status(400).json({
                error: "No user was found in DB",
                errorMsg : err
            });
        }
        req.profile = user;
        next();
    })
}

exports.getUser = (req, res) => {
    req.profile.salt = undefined;
    req.profile.encry_password = undefined;
    req.profile.createdAt = undefined;
    req.profile.updatedAt = undefined;
    
    return res.json(req.profile);
};


// PUT
exports.updateUser = (req, res) => {

    User.findByIdAndUpdate(
        {_id: req.profile._id},
        {$set: req.body},
        {new: true, useFindAndModify: false},
        (err, user) => {
            if(err){ // we are not checking !user because if user is null it will automatically give error due to {_id: req.profile._id}
                return res.status(400).json({
                    error: "You are not authorosed to update this user"
                });
            }
            user.salt = undefined;
            user.encry_password = undefined;
            user.createdAt = undefined;
            user.updatedAt = undefined;
            return res.json(user);
        }
    )
}


exports.userPurchaseList = (req, res) => { // seeing everything from the order schema
    Order.find({user: req.profile._id})
    .populate("user", "_id name")
    .exec((err, order)=>{
        if(err){
            res.status(400).json({
                error: "No Order in this account"
            });
        }
        return res.json(order);
    })
}

exports.pushOrderInPurchaseList = (req, res, next) => {

    let purchases = [];

    req.body.order.products.forEach(product => {
        purchases.push({
            _id: product._id,
            name: product.name,
            description: product.description,
            category: product.category,
            quantity: product.quantity,
            amount: req.body.order.amount,
            transaction_id: req.body.order.transaction_id
        });
    });

    // Store purchases in DB
    User.findByIdAndUpdate(
        {_id: req.profile._id},
        {$push: {purchases: purchases}},
        {new: true},
        (err, purchases) => {
            if(err){
                return res.status(400).json({
                    error: "Unable to save purchase List"
                });
            }
            next();
        }
    )
}
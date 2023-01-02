const { json } = require("body-parser");
const { Order, ProductCart } = require("../models/order");

exports.getOrderById = (req, res, next) => {

    const orderId = req.params.orderId;
    Order.findById(orderId)
    .populate("products.product", "name price")
    .exec((err, order)=>{
        if(err){
            return res.status(400).json({
                error: "Order not found in DB"
            });
        }

        req.order = order;
        next();
    })
}

exports.createOrder = (req, res) => {
    req.body.order.user = req.profile;
    const order = new Order(req.body.order);
    order.save((err, order)=>{
        if(err){
            return res.status(400).json({
                error: "Failed to save your order in DB"
            });
        }
        return res.json(order);
    })
}

exports.getAllOrders = (req, res) => {

    Order.find()
    .populate("user", "_id name")
    .exec((err, orders)=>{
        if(err){
            return res.status(400).json({
                error: "No orders found in DB"
            });
        }
        return json(orders);
    });

}

exports.getOrderStatus = (req, res) => {
    res.json(Order.schema.path("status").enumValues);
}

exports.updateStatus = (req, res) => {
    
    Order.update(
        {_id: req.body.orderd},
        {$set: {status: req.body.status}},
        (err, order) => {
            if(err){
                return res.status(400).json({
                    error: "Cannot update order status"
                })
            }
            res.json(order);
        }
    )
}
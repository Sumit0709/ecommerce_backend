const Product = require("../models/product");
const formidable = require('formidable');
const _ = require('lodash');
const fs = require("fs");


// create Product
exports.createProduct = (req, res) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;

    form.parse(req, (err, fields, file) => {
        if(err){
            return res.status(400).json({
                error: "Problem with file"
            })
        }

        //destructuring the fields
        const { name, description, price, category, stock} = fields;

        if(
            !name ||
            !description ||
            !price ||
            !category ||
            !stock
        ){
            return res.status(400).json({
                error: "Please include all fields"
            });
        }

        let product = new Product(fields);
        
        // handle file
        if(file.photo){
            if(file.photo.size > 3000000){
                return res.status(400).json({
                    error: "File size is too big!" 
                });
            }
            product.photo.data = fs.readFileSync(file.photo.path);
            product.photo.contentType = file.photo.type;
        }

        // save to the DB
        product.save((err, product) => {
            if(err){
                return res.status(400).json({
                    error: "Saving tshirt in DB failed"
                });
            }
            return res.json(product);
        })
    })
}


// read product
exports.getProductById = (req, res, next) => {
    const productId = req.params.productId;

    Product.findById(productId)
    .populate("category")
    .exec((err, product) => {
        if(err || !product){
            return res.status(400).json({
                error: `Could not find product with id: ${productId}`
            });
        }
        req.product = product;
        next();
    });
} 

exports.getProduct = (req, res) => {
    req.product.photo = undefined
    return res.json(req.product);
}

exports.photo = (req, res, next) => {
    if(req.product.photo) {
        res.set("Content-Type", req.product.photo.data.contentType); // may be it should be req.product.photo.data.contentType -> DONE
        return res.send(req.product.photo.data);
    }
    next();
}

// delete product
exports.removeProduct = (req, res) => {

    try{
        let product = req.product;
        console.log(product)
        if(!product){
            return res.json({error: "No product found"})
        }
    
    product.remove((err, deletedProduct) => {
        if(err){
            return res.status(400).json({
                error: "Failed to delete the product",
            });
        }
        return res.json({
            mesage: "Deletion was successfull",
            deletedProduct
        })
    })
    }
    catch(err){
        console.log(err);
    }
}


// update product
exports.updateProduct = (req, res) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;

    form.parse(req, (err, fields, file) => {
        if(err){
            return res.status(400).json({
                error: "Problem with file"
            })
        }

        //destructuring the fields
        const { name, description, price, category, stock} = fields;

        // updation code
        let product = req.product;
        product = _.extend(product, fields);
        
        // handle file
        if(file.photo){
            if(file.photo.size > 3000000){
                return res.status(400).json({
                    error: "File size is too big!" 
                });
            }
            product.photo.data = fs.readFileSync(file.photo.path);
            product.photo.contentType = file.photo.type;
        }

        // save to the DB
        product.save((err, product) => {
            if(err){
                return res.status(400).json({
                    error: "Updation of tshirt in DB failed"
                });
            }
            return res.json(product);
        })
    })
}


// lsiting products
exports.getAllProducts = (req, res) => {
    let limit = req.query.limit? parseInt(req.quey.limit) : 10;
    let sortBy = req.query.sortBy? req.query.sortBy : "_id";

    Product.find()
    .select("-photo")
    .populate("category")
    .sort([[sortBy, "asc"]])
    .limit(limit)
    .exec((err, products) => {
        if(err || !products){
            return res.status(400).json({
                error: "No product found"
            });
        }
        return res.json(products);
    })
}


//
exports.getAllUniqueCategories = (req, res) => {
    Product.distinct("category", {}, (err, categories) => {
        if(err){
            return res.status(400).json({
                error: "No categories found"
            });
        }
        res.json(categories);
    })
}






// update stock
exports.updateStock = (req, res, next) => {

    let myOperations = req.body.order.products.map(prod => {
        return {
            updateOne: {
                filter: {_id: prod._id},
                update: {$inc: {stock: -prod.count, sold: +prod.count}}
            }
        }
    });

    Product.bulkWrite(myOperations, {}, (err, products)=>{
        if(err){
            return res.status(400).json({
                error: "Bulk Operation failed"
            })
        }
        next();
    })
}


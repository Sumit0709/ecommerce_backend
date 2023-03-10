const Category = require("../models/category");

exports.getCategoryById = (req, res, next) => {

    const categoryId = req.params.categoryId;

    Category.findById({_id: categoryId}).exec((err, category) => {
        if(err || !category){
            return res.status(400).json({
                error: "Category not found in DB"
            });
        }

        req.category = category;
        next();
    })

}

exports.createCategory = (req, res) => {
    const category = new Category(req.body);
    category.save((err, category) => {
        if(err || !category){
            return res.status(400).json({
                error: "Not able to save Category in DB"
            });
        }
        res.json(category);
    })
}

exports.getCategory = (req, res) => {
    return res.json(req.category);
}
exports.getAllCategory = (req, res) => {

    Category.find().exec((err, categories) => {
        if(err || !categories){
            return res.status(400).json({
                error: "No categories found in DB"
            });
        }

        res.json(categories);
    })
}

exports.updateCategory = (req, res) => {
    const category = req.category;
    category.name = req.body.name;

    category.save((err, updatedCategory) => {
        if(err){
            return res.status(400).json({
                error: "Failed to update category in DB"
            });
        }

        res.json(updatedCategory);
    })
}

exports.removeCategory = (req, res) => {
    const category = req.category;

    category.remove((err, deletedCategory) => {
        if(err){
            return res.status(400).json({
                error: "Failed to delete category in DB"
            });
        }
        return res.json({
            message: `Successfully deleted ${deletedCategory}`
        });
    })
}
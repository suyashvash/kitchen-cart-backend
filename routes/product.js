import { Router } from "express";
import Product from "../models/product.model.js";
import { sendResponse } from "../middleware/sendResponse.js";


const productRouter = Router();


productRouter.route('/').get((req, res) => {
    Product.find()
        .then(products => sendResponse(res, true, products, "Products found !", 200))
        .catch(err => sendResponse(res, false, err, "Products not found !", 400));
}
);

productRouter.route('/add').post((req, res) => {

    const { title, description, price, quantity, image, rating, brand, category } = req.body;
    const user = req.get('user');

    if (user == 'admin@123') {
        const newProduct = new Product({
            title,
            description,
            price,
            image,
            rating,
            brand,
            category
        });

        newProduct.save()
            .then(() => sendResponse(res, true, newProduct, "Product added !", 200))
            .catch(err => sendResponse(res, false, err, "Product not added !", 400));
    } else {
        sendResponse(res, false, null, "You are not authorized to add product !", 401);
    }
})

productRouter.route('/findById/:id').get((req, res) => {
    Product.findById(req.params.id)
        .then(product => sendResponse(res, true, product, "Product found !", 200))
        .catch(err => sendResponse(res, false, err, "Product not found !", 400));
})

productRouter.route('/:id').delete((req, res) => {
    const user = req.get('user');

    if (user == 'admin@123') {
        Product.findByIdAndDelete(req.params.id)
            .then(() => sendResponse(res, true, null, "Product deleted !", 200))
            .catch(err => sendResponse(res, false, err, "Product not deleted !", 400));
    } else {
        sendResponse(res, false, null, "You are not authorized to delete product !", 401);
    }
})

productRouter.route('/similar').get((req, res) => {

    const category = req.query.category;

    if (!category) { 
        sendResponse(res, false, null, "Category not found !", 400); 
        return;
    }


    Product.find({ category: category })
        .then(products => sendResponse(res, true, products, "Products found !", 200))
        .catch(err => sendResponse(res, false, err, "Products not found !", 400));

})

productRouter.route('/byBrand').get((req, res) => {

    const category = req.query.text;

    if (!category) { 
        sendResponse(res, false, null, "Brand not found !", 400); 
        return;
    }

  


    Product.find({ brand: category })
        .then(products => sendResponse(res, true, products, "Products found !", 200))
        .catch(err => sendResponse(res, false, err, "Products not found !", 400));

})

// Search product
productRouter.route('/search').get((req, res) => {

    const search = req.query.query;

    if (!search) {
        sendResponse(res, false, null, "Search not found !", 400);
        return;
    }

    Product.find({ title: { $regex: search, $options: 'i' }})
        .then(products => sendResponse(res, true, products, "Products found !", 200))
        .catch(err => sendResponse(res, false, err, "Products not found !", 400));

})


productRouter.route('/update/:id').post((req, res) => {
    const user = req.get('user');

    if (user == 'admin@123') {
        Product.findById(req.params.id)
            .then(product => {
                product.title = req.body.title;
                product.description = req.body.description;
                product.price = req.body.price;
                product.image = req.body.image;
                product.rating = req.body.rating;
                product.brand = req.body.brand;
                product.category = req.body.category;

                product.save()
                    .then(() => sendResponse(res, true, product, "Product updated !", 200))
                    .catch(err => sendResponse(res, false, err, "Product not updated !", 400));
            })
            .catch(err => sendResponse(res, false, err, "Product not found !", 400));
    } else {
        sendResponse(res, false, null, "You are not authorized to update product !", 401);
    }
})



export default productRouter;
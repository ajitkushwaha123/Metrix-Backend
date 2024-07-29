import { Product } from "../models/Product.model.js";

export const add_product = async (req, res) => {
    try {
        // Assuming req.body contains the necessary fields
        const arrImages = req.files || []; // Use an empty array as a fallback

        const productInstance = new Product({
            title: req.body.title,
            shortDescription: req.body.shortDescription,
            category: req.body.category,
            price: req.body.price,
            images: arrImages,
        });

        const product_data = await productInstance.save();
        res.status(200).send({ success: true, msg: "Product added successfully", data: product_data });
    } catch (error) {
        res.status(400).send({ success: false, msg: "Error adding product: " + error.message });
    }
};

export const get_products = async (req, res) => {
    try {
        // Fetch product data from your database
        const product_data = await Product.find(); // Example query; adjust as needed

        res.status(200).send({ success: true, msg: "Product details retrieved", data: product_data });
    } catch (error) {
        res.status(500).send({ success: false, msg: "Error fetching product details: " + error.message });
    }
};

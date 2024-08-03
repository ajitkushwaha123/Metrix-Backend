import { Product } from "../models/Product.model.js";
import Auth from "../middleware/auth.js";
import express from "express";
import { v2 as cloudinary } from "cloudinary";
import { upload } from "../middleware/multer.js";

const products = express();

products.get("/", Auth, async (req, res) => {
  try {
    const searchQuery = req.query.search;
    console.log(searchQuery);
    let products;
    if (!searchQuery) {
      console.log("No search query");
    }
    if (searchQuery) {
      products = await Product.find({
        productName: { $regex: searchQuery, $options: "i" },
      });
    } else {
      products = await Product.find();
    }
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

products.get("/" , Auth , async (req , res) => {
  const userId = req.user.userId;
  console.log("User ID:" , userId);
  try{
    const products = await Product.find({userId : userId});
    res.status(200).json(products);
  }
  catch(err){
    console.error("Error fetching products:" , err);
    res.status(500).json({error : "Failed to fetch products. Please try again later."});
  }
});

products.get("/size", Auth, async (req, res) => {
  const userId = req.user.userId;
  console.log("User ID:", userId);
  try {
    const productData = await Product.aggregate([
      {
        $match: { userId: req.user.userId },
      },
      {
        $group: {
          _id: "$size",
          total: { $sum: 1 },
          totalPublished: {
            $sum: {
              $cond: [{ $eq: ["$status", "published"] }, 1, 0],
            },
          },
          totalDraft: {
            $sum: {
              $cond: [{ $eq: ["$status", "draft"] }, 1, 0],
            },
          },
          lowStock: {
            $sum: {
              $cond: [{ $lt: ["$stock", 5] }, 1, 0],
            },
          },
          expired: {
            $sum: {
              $cond: [{ $lte: ["$stock", 0] }, 1, 0],
            },
          },
          sufficientStock: {
            $sum: {
              $cond: [{ $gte: ["$stock", 5] }, 1, 0],
            },
          },
        },
      },
    ]);

    console.log(productData);
    const productResData =
      productData.length > 0
        ? productData[0]
        : {
            total: 0,
            totalPublished: 0,
            totalDraft: 0,
            lowStock: 0,
            expired: 0,
            sufficientStock: 0,
          };

    return res.status(200).json({ productDetail: productResData });
  } catch (err) {
    console.error(err); // Log the error for debugging
    return res.status(500).json({ error: "Internal Server Error" });
  }
});


// Create a new product
products.post("/", upload.array("photos", 4), Auth, async (req, res) => {
  try {
    const {
      productName,
      discountPrice,
      orderType,
      longDescription,
      variant,
      shortDescription,
      category,
      price,
      stock,
      status,
      userId,
      // photos,
    } = req.body;

    console.log("red", req.body);

    console.log("req.files", req.files);

    if (req.files && req.files.length > 0) {
      const uploadPromises = req.files.map((file) =>
        cloudinary.uploader.upload(file.path)
      );
      const results = await Promise.all(uploadPromises);
      console.log("results", results);

      const photoUrls = results.map((result) => result.url);

      console.log(photoUrls);

      const newProduct = new Product({
        productName,
        discountPrice,
        orderType,
        longDescription,
        variant,
        shortDescription,
        category,
        price,
        stock,
        status,
        photos: photoUrls, // Store array of photo URLs
        userId: req.user.userId,
      });

      console.log("newProduct", newProduct);

      console.log("newProduct", newProduct);
      const savedProduct = await newProduct.save();
      console.log("savedProduct", savedProduct);
      res.status(200).json(savedProduct);
    } else {
      res.status(400).json({ error: "No photos uploaded" });
    }
  } catch (err) {
    console.error("Error saving product:", err);
    res.status(500).json({ error: err.message });
  }
});

//Update
products.put("/:id", upload.array("photos"), Auth, async (req, res, next) => {
  const { id } = req.params; // Corrected destructuring

  console.log(id);
  console.log(req.body);

  if (req.files && req.files.length > 0) {
    try {
      const uploadPromises = req.files.map((file) =>
        cloudinary.uploader.upload(file.path)
      );
      const results = await Promise.all(uploadPromises);
      console.log("results", results);

      const photoUrls = results.map((result) => result.url);
      req.body.photos = photoUrls; // Add photo URLs to the request body
      console.log("body", req.body);
    } catch (error) {
      return res.status(500).json({ error: "Error uploading photos" });
    }
  }

  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      {
        $set: req.body,
      },
      { new: true }
    );
    console.log("updatedProduct", updatedProduct);
    if (!updatedProduct) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.status(200).json(updatedProduct);
  } catch (err) {
    res.status(500).json(err);
  }
});

//Delete
products.delete("/:id", Auth, async (req, res) => {
  // const newProduct = new Product(req.body);

  try {
    await Product.findByIdAndDelete(req.params.id);
    res.status(200).json("Product has been deleted...");
  } catch (err) {
    res.status(500).json(err);
  }
});

//Get Products
products.get("/:id", Auth, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    res.status(200).json(product);
  } catch (err) {
    res.status(500).json(err);
  }
});


// products.get("/", Auth, async (req, res) => {
//   const qNew = req.query.new;
//   const qCategory = req.query.category;
//   const { userId } = req.user;

//   try {
//     let products;
//     if (qNew) {
//       // Fetch the latest 5 products based on creation date
//       products = await Product.find({ userId })
//         .sort({ createdAt: -1 })
//         .limit(5);
//     } else if (qCategory) {
//       // Fetch products based on the specified category
//       products = await Product.find({
//         userId,
//         category: {
//           $in: [qCategory],
//         },
//       });
//     } else {
//       // Fetch all products
//       products = await Product.find({ userId });
//     }
//     res.status(200).json(products);
//   } catch (err) {
//     console.error("Error fetching products:", err);
//     res
//       .status(500)
//       .json({ error: "Failed to fetch products. Please try again later." });
//   }
// });



export default products;

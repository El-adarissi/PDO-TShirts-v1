const express = require("express");
const router = express.Router();
const Product = require("../models/Product");
const User = require("../models/User");
const multer = require("multer");
const FILE_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpeg",
  "image/jpg": "jpg",
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const isValid = FILE_TYPE_MAP[file.mimetype];
    let uploadError = new Error("invalid image type");

    if (isValid) {
      uploadError = null;
    }
    cb(uploadError, "public/uploads");
  },
  filename: function (req, file, cb) {
    const fileName = file.originalname.split(" ").join("-");
    const extension = FILE_TYPE_MAP[file.mimetype];
    cb(null, `${fileName}-${Date.now()}.${extension}`);
  },
});

const uploadOptions = multer({ storage: storage });

// gets all users
router.get("/users", async (req, res) => {
  try {
    const userList = await User.findAll();
    res.json(userList);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get user by id
router.get("/users/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }

    res.json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// gets all Products
router.get("/products", async (req, res) => {
  try {
    const productList = await Product.findAll();
    
    res.status(200).json({
      productList: productList.map((product) => {
        return {
          id: product.id,
          name: product.name,
          description: product.description,
          richDescription: product.richDescription,
          image: product.image, // Main image URL
          images: JSON.parse(product.images), // Parse the images JSON array
          price: product.price,
          oldprice: product.oldprice,
          rating: product.rating,
          isFeatured: product.isFeatured,
          dateCreated: product.dateCreated,
          Category: product.Category,
          colorOptions: JSON.parse(product.colorOptions),
          sizeOptions: JSON.parse(product.sizeOptions),
        };
      }),
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// router.get("/products", async (req, res) => {
//   try {
//     const productList = await Product.findAll();
//     res.status(200).json({
//       productList: productList.map((product) => {
//         return {
//           ...product,
//           colorOptions: JSON.parse(product.colorOptions),
//           sizeOptions: JSON.parse(product.sizeOptions),
//         };
//       }),
//     });
//   } catch (error) {
//     console.error("Error fetching products:", error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// });

// Get Product by id
router.get("/products/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const product = await Product.findByPk(id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Add Product
router.post(
  "/products",
  uploadOptions.array("images", 10),
  async (req, res) => {
    const files = req.files;

    if (!files || files.length === 0) {
      return res.status(400).json({ message: "No images in the request" });
    }

    const basePath = `${req.protocol}://${req.get("host")}/public/uploads/`;
    const imageUrls = files.map((file) => `${basePath}${file.filename}`);

    let colorOptions = [];
    let sizeOptions = [];
    try {
      if (req.body.colorOptions) {
        colorOptions = JSON.parse(req.body.colorOptions);
      }
      if (req.body.sizeOptions) {
        sizeOptions = JSON.parse(req.body.sizeOptions);
      }
    } catch (error) {
      return res
        .status(400)
        .json({ message: "Invalid JSON in colorOptions or sizeOptions" });
    }
    console.log(typeof sizeOptions);
    console.log(typeof colorOptions);
    console.log(typeof imageUrls);
    console.log(sizeOptions);
    console.log(colorOptions);
    console.log(imageUrls);

    try {
      const newProduct = await Product.create({
        name: req.body.name,
        description: req.body.description,
        richDescription: req.body.richDescription || "",
        image: imageUrls[0], // First image as main
        images: imageUrls,
        oldprice: parseFloat(req.body.oldprice) || 0,
        price: parseFloat(req.body.price) || 0,
        rating: parseFloat(req.body.rating) || 0,
        isFeatured: req.body.isFeatured === "true",
        Category: req.body.Category || "ALL",
        colorOptions,
        sizeOptions,
      });

      res.status(201).json({
        message: "Product created successfully",
        product: newProduct,
      });
    } catch (error) {
      console.error("Error adding product:", error.message);
      res.status(500).json({ message: "Internal server error" });
    }
  },
);

// Delete a product by ID
router.delete("/products/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const deletedProduct = await Product.destroy({ where: { id } });
    if (deletedProduct) {
      res.json({ message: "Product deleted successfully" });
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;

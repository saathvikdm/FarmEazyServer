import db from "../models";
const User = db.User;
const Product = db.Product;

const createProduct = (req, res) => {
  let product = req.body;

  if (!req.body.UserId) product.UserId = req.user[0].dataValues.id;

  if (!req.file) {
    res.status(400).send("ERROR: file not found");
  } else {
    let imgPath = process.env.IMG_PATH + req.file.filename;
    product.image = imgPath;
  }

  Product.create(product)
    .then((product) => {
      res.json({ product });
    })
    .catch((err) => {
      res.status(500).json({ err });
    });
};

// fetch all products
const findAllProducts = (req, res) => {
  Product.findAll({
    include: [
      {
        model: User,
        attributes: { exclude: ["password", "createdAt", "updatedAt"] },
      },
    ],
  })
    .then((product) => {
      res.json({ product });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ err });
    });
};

// fetch product by productId
const findProductById = (req, res) => {
  const id = req.params.productId;

  Product.findAll({
    where: { id },
    include: [
      {
        model: User,
        attributes: { exclude: ["password", "createdAt", "updatedAt"] },
      },
    ],
  })
    .then((product) => {
      if (!product.length) {
        return res.json({ msg: "product not found" });
      }
      res.json({ product });
    })
    .catch((err) => res.status(500).json({ err }));
};

// update product info
const updateProduct = (req, res) => {
  let product = req.body;
  const id = req.params.productId;

  if (!req.file) {
    product.image = product.image || "";
  } else {
    let imgPath = process.env.IMG_PATH + req.file.filename;
    product.image = imgPath;
  }

  Product.update(product, { where: { id } })
    .then((product) => res.status(200).json({ product }))
    .catch((err) => res.status(500).json({ err }));
};

// delete product
const deleteProduct = (req, res) => {
  const id = req.params.productId;

  Product.destroy({ where: { id } })
    .then((product) =>
      res.status(200).json({ msg: "Product has been deleted successfully!" })
    )
    .catch((err) => res.status(500).json({ msg: "Something went wrong." }));
};

export {
  createProduct,
  findAllProducts,
  findProductById,
  updateProduct,
  deleteProduct,
};

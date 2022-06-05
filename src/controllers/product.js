import db from "../models";
const User = db.User;
const Product = db.Product;

const createProduct = (req, res) => {
  let product = req.body;

  product.UserId = req.user[0].dataValues.id;

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
  Product.findAll()
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

  Product.update(product, { where: { id } })
    .then((product) => res.status(200).json({ product }))
    .catch((err) => res.status(500).json({ err }));
};

// delete product
const deleteProduct = (req, res) => {
  const id = req.params.userId;

  User.destroy({ where: { id } })
    .then((user) =>
      res.status.json({ msg: "User has been deleted successfully!" })
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

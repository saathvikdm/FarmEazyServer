import db from "../models";
const User = db.User;
const Order = db.Order;
const Product = db.Product;

const createOrder = (req, res) => {
  let order = req.body;

  order.UserId = req.user[0].dataValues.id;

  Order.create(order)
    .then((order) => {
      res.json({ order });
    })
    .catch((err) => {
      res.status(500).json({ err });
    });
};

// fetch all Orders
const findAllOrders = (req, res) => {
  Order.findAll({
    include: [
      {
        model: User,
        attributes: { exclude: ["password", "createdAt", "updatedAt"] },
      },
      {
        model: Product,
        attributes: { exclude: ["createdAt", "updatedAt"] },
        include: {
          model: User,
          attributes: {
            include: [
              ["firstname", "sellerfname"],
              ["lastname", "sellerlname"],
            ],
            exclude: ["firstname", "password", "createdAt", "updatedAt"],
          },
        },
      },
    ],
  })
    .then((order) => {
      res.json({ order });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ err });
    });
};

// fetch Order by OrderId
const findOrderById = (req, res) => {
  const id = req.params.orderId;

  Order.findAll({
    where: { id },
    include: [
      {
        model: User,
        attributes: { exclude: ["password", "createdAt", "updatedAt"] },
      },
      {
        model: Product,
        attributes: { exclude: ["createdAt", "updatedAt"] },
        include: {
          model: User,
          attributes: {
            include: [
              ["firstname", "sellerfname"],
              ["lastname", "sellerlname"],
            ],
            exclude: [
              "firstname",
              "lastname",
              "password",
              "createdAt",
              "updatedAt",
            ],
          },
        },
      },
    ],
  })
    .then((order) => {
      if (!order.length) {
        return res.json({ msg: "order not found" });
      }
      res.json({ order });
    })
    .catch((err) => res.status(500).json({ err }));
};

// update Order info
const updateOrder = (req, res) => {
  let order = req.body;
  const id = req.params.orderId;

  Order.update(order, { where: { id } })
    .then((order) => res.status(200).json({ order }))
    .catch((err) => res.status(500).json({ err }));
};

// delete Order
const deleteOrder = (req, res) => {
  const id = req.params.orderId;

  Order.destroy({ where: { id } })
    .then((order) =>
      res.status.json({ msg: "Order has been deleted successfully!" })
    )
    .catch((err) => res.status(500).json({ msg: "Something went wrong." }));
};

export { createOrder, findAllOrders, findOrderById, updateOrder, deleteOrder };

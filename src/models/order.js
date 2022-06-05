export default (sequelize, DataTypes) => {
  const Order = sequelize.define(
    "Order",
    {
      price: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      qty: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      fullfilled: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {}
  );

  Order.associate = function (models) {
    Order.belongsTo(models.User);

    Order.belongsTo(models.Product);
  };
  return Order;
};

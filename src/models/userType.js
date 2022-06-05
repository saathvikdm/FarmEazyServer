export default (sequelize, DataTypes) => {
  const UserType = sequelize.define(
    "UserType",
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      accessLevel: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      role: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    { timestamps: false },
    {}
  );

  UserType.associate = function (models) {
    UserType.hasMany(models.User);
  };

  return UserType;
};

module.exports = (sequelize, DataTypes) => {
  const Address = sequelize.define(
    "Address",
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      country: {
        type: DataTypes.TEXT("tiny"),
        allowNull: false,
      },
      city: {
        type: DataTypes.TEXT("tiny"),
        allowNull: false,
      },
      street: {
        type: DataTypes.TEXT("tiny"),
        allowNull: false,
      },
      lat: {
        type: DataTypes.DECIMAL(14, 10),
        allowNull: true,
      },
      lng: {
        type: DataTypes.DECIMAL(14, 10),
        allowNull: true,
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        onUpdate: DataTypes.NOW,
      },
    },
    {
      tableName: "Address",
      timestamps: true,
    }
  );

  Address.associate = function (models) {
    Address.hasMany(models.Subsidiary, {
      foreignKey: "addressId",
    });

    Address.hasMany(models.Event, {
      foreignKey: "addressId",
    });
  };

  return Address;
};

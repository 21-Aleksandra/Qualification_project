module.exports = (sequelize, DataTypes) => {
  const Photo_Set = sequelize.define(
    "Photo_Set",
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
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
      tableName: "Photo_Set",
      timestamps: true,
    }
  );

  Photo_Set.associate = function (models) {
    Photo_Set.hasMany(models.Photo, {
      foreignKey: "photoSetId",
    });

    Photo_Set.belongsTo(models.Subsidiary, {
      foreignKey: "id",
      targetKey: "photoSetId",
    });

    Photo_Set.belongsTo(models.Event, {
      foreignKey: "id",
      targetKey: "photoSetId",
    });
  };

  return Photo_Set;
};

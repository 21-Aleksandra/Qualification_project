module.exports = (sequelize, DataTypes) => {
  const News_Set = sequelize.define(
    "News_Set",
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
      tableName: "News_Set",
      timestamps: true,
    }
  );

  News_Set.associate = function (models) {
    News_Set.hasMany(models.News, {
      foreignKey: "newsSetId",
    });

    News_Set.belongsTo(models.Subsidiary, {
      foreignKey: "id",
      targetKey: "newsSetId",
    });

    News_Set.belongsTo(models.Event, {
      foreignKey: "id",
      targetKey: "newsSetId",
    });
  };

  return News_Set;
};

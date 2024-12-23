module.exports = (sequelize, DataTypes) => {
  const Comment_Set = sequelize.define(
    "Comment_Set",
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
      tableName: "Comment_Set",
      timestamps: true,
    }
  );

  Comment_Set.associate = function (models) {
    Comment_Set.hasMany(models.Comment, {
      foreignKey: "commentSetId",
    });

    Comment_Set.belongsTo(models.Subsidiary, {
      foreignKey: "id",
      targetKey: "commentSetId",
    });

    Comment_Set.belongsTo(models.Event, {
      foreignKey: "id",
      targetKey: "commentSetId",
    });

    Comment_Set.belongsTo(models.News, {
      foreignKey: "id",
      targetKey: "commentSetId",
    });
  };

  return Comment_Set;
};

module.exports = (sequelize, DataTypes) => {
  const Photo = sequelize.define(
    "Photo",
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      url: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      filename: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      type: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      photoSetId: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      isBannerPhoto: {
        type: DataTypes.BOOLEAN,
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
      tableName: "Photo",
      timestamps: true,
    }
  );

  Photo.associate = function (models) {
    Photo.belongsTo(models.Photo_Set, {
      foreignKey: "photoSetId",
    });
  };

  return Photo;
};

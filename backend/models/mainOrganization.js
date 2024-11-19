module.exports = (sequelize, DataTypes) => {
  const Main_Organization = sequelize.define(
    "Main_Organization",
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.TEXT("tiny"),
        allowNull: false,
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
      tableName: "Main_Organization",
      timestamps: true,
    }
  );

  Main_Organization.associate = function (models) {
    Main_Organization.hasMany(models.Subsidiary, {
      foreignKey: "mainOrganizationId",
    });
  };

  return Main_Organization;
};

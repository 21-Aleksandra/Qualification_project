module.exports = (sequelize, DataTypes) => {
  const Mission = sequelize.define(
    "Mission",
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING(100),
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
      tableName: "Mission",
      timestamps: true,
    }
  );

  Mission.associate = function (models) {
    Mission.belongsToMany(models.Subsidiary, {
      through: models.Subsidiary_Mission,
      foreignKey: "missionId",
      otherKey: "subsidiaryId",
    });
  };

  return Mission;
};

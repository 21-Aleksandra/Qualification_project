module.exports = (sequelize, DataTypes) => {
  const Subsidiary_Mission = sequelize.define(
    "Subsidiary_Mission",
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      missionId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      subsidiaryId: {
        type: DataTypes.INTEGER,
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
      tableName: "Subsidiary_Mission",
      timestamps: true,
    }
  );

  return Subsidiary_Mission;
};

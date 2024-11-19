module.exports = (sequelize, DataTypes) => {
  const Subsidiary_Manager = sequelize.define(
    "Subsidiary_Manager",
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      managerId: {
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
      tableName: "Subsidiary_Manager",
      timestamps: true,
    }
  );

  return Subsidiary_Manager;
};

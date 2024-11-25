module.exports = (sequelize, DataTypes) => {
  const Role = sequelize.define(
    "Role",
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      rolename: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
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
      tableName: "Role",
      timestamps: true,
    }
  );

  Role.associate = function (models) {
    Role.belongsToMany(models.User, {
      through: models.User_Role,
      foreignKey: "roleId",
      otherKey: "userId",
    });
  };

  return Role;
};

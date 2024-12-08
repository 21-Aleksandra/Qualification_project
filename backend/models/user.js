module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "User",
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      username: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
      },
      password: {
        type: DataTypes.STRING(255),
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
      isVerified: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
    },
    {
      tableName: "User",
      timestamps: true,
    }
  );

  User.associate = function (models) {
    User.belongsToMany(models.Role, {
      through: models.User_Role,
      foreignKey: "userId",
      otherKey: "roleId",
    });

    User.belongsToMany(models.Subsidiary, {
      through: models.Subsidiary_Manager,
      foreignKey: "managerId",
      otherKey: "subsidiaryId",
    });

    User.belongsToMany(models.Event, {
      through: models.Event_User,
      foreignKey: "userId",
      otherKey: "eventId",
    });

    User.hasMany(models.Event, {
      foreignKey: "authorId",
    });
  };

  return User;
};

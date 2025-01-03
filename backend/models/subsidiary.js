module.exports = (sequelize, DataTypes) => {
  const Subsidiary = sequelize.define(
    "Subsidiary",
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      mainOrganizationId: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      name: {
        type: DataTypes.TEXT("tiny"),
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      foundedAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      addressId: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      photoSetId: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      newsSetId: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      commentSetId: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      email: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      website: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      staffCount: {
        type: DataTypes.INTEGER,
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
      tableName: "Subsidiary",
      timestamps: true,
    }
  );

  Subsidiary.associate = function (models) {
    Subsidiary.belongsTo(models.Address, {
      foreignKey: "addressId",
    });

    Subsidiary.hasOne(models.Photo_Set, {
      foreignKey: "id",
      sourceKey: "photoSetId",
    });

    Subsidiary.hasOne(models.News_Set, {
      foreignKey: "id",
      sourceKey: "newsSetId",
    });

    Subsidiary.hasOne(models.Comment_Set, {
      foreignKey: "id",
      sourceKey: "commentSetId",
    });

    Subsidiary.belongsTo(models.Main_Organization, {
      foreignKey: "mainOrganizationId",
    });

    Subsidiary.belongsToMany(models.Mission, {
      through: models.Subsidiary_Mission,
      foreignKey: "subsidiaryId",
      otherKey: "missionId",
    });

    Subsidiary.belongsToMany(models.User, {
      through: models.Subsidiary_Manager,
      foreignKey: "subsidiaryId",
      otherKey: "managerId",
    });

    Subsidiary.hasMany(models.Event, {
      foreignKey: "subsidiaryId",
    });
  };

  return Subsidiary;
};

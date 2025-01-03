module.exports = (sequelize, DataTypes) => {
  const Event = sequelize.define(
    "Event",
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      typeId: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      dateFrom: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      dateTo: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      publishOn: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      applicationDeadline: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      addressId: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      subsidiaryId: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      authorId: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      maxPeopleAllowed: {
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
      tableName: "Event",
      timestamps: true,
    }
  );

  Event.associate = function (models) {
    Event.belongsTo(models.Event_Type, {
      foreignKey: "typeId",
    });

    Event.belongsTo(models.Address, {
      foreignKey: "addressId",
    });

    Event.belongsTo(models.Subsidiary, {
      foreignKey: "subsidiaryId",
    });

    Event.hasOne(models.Photo_Set, {
      foreignKey: "id",
      sourceKey: "photoSetId",
    });

    Event.hasOne(models.News_Set, {
      foreignKey: "id",
      sourceKey: "newsSetId",
    });

    Event.hasOne(models.Comment_Set, {
      foreignKey: "id",
      sourceKey: "commentSetId",
    });

    Event.belongsToMany(models.User, {
      through: models.Event_User,
      as: "Participants",
      foreignKey: "eventId",
      otherKey: "userId",
    });

    Event.belongsTo(models.User, {
      foreignKey: "authorId",
      as: "Author",
    });
  };

  return Event;
};

module.exports = (sequelize, DataTypes) => {
  const Event_Type = sequelize.define(
    "Event_Type",
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
      tableName: "Event_Type",
      timestamps: true,
    }
  );

  Event_Type.associate = function (models) {
    Event_Type.hasMany(models.Event, {
      foreignKey: "typeId",
    });
  };

  return Event_Type;
};

module.exports = (sequelize, DataTypes) => {
  const Request_Sequences = sequelize.define(
    "Request_Sequences",
    {
      code: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
      },
      number: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize.fn("NOW"),
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize.fn("NOW"),
        onUpdate: sequelize.fn("NOW"),
      },
    },
    {
      tableName: "Request_Sequences",
      timestamps: true,
    }
  );

  return Request_Sequences;
};

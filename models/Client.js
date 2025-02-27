const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Client = sequelize.define('Client', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true
    },
    userId: { // Owner of the client record
      type: DataTypes.UUID,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: DataTypes.STRING,
    phone: DataTypes.STRING,
    address: DataTypes.STRING,
  }, {
    tableName: 'clients',
    timestamps: true
  });

  return Client;
};

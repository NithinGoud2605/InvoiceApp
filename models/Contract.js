// models/Contract.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Contract = sequelize.define('Contract', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false
    },
    clientId: {  // Reference to Client
      type: DataTypes.UUID,
      allowNull: true
    },
    planName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('ACTIVE', 'CANCELLED', 'TRIAL'),
      defaultValue: 'TRIAL'
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: false
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    billingCycle: { // New field
      type: DataTypes.ENUM('MONTHLY', 'YEARLY'),
      allowNull: true
    },
    autoRenew: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    externalSubscriptionId: {
      type: DataTypes.STRING,
      allowNull: true
    },
    // Add the pdfUrl field here:
    pdfUrl: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    tableName: 'contracts',
    timestamps: true
  });

  return Contract;
};

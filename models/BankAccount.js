// models/BankAccount.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const BankAccount = sequelize.define('BankAccount', {
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
    bankName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    accountType: {
      type: DataTypes.ENUM('CHECKING', 'SAVINGS', 'CREDIT'),
      defaultValue: 'CHECKING'
    },
    accountLast4: {
      type: DataTypes.STRING(4),
      allowNull: true
    },
    // You might store an accessToken or reference from Plaid, etc.
    externalAccountId: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    tableName: 'bank_accounts',
    timestamps: true
  });

  return BankAccount;
};

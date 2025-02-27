const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Invoice = sequelize.define('Invoice', {
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
    clientId: {  // New: Reference to a client
      type: DataTypes.UUID,
      allowNull: true
    },
    status: {
      type: DataTypes.ENUM('DRAFT', 'SENT', 'PAID', 'CANCELLED'),
      defaultValue: 'DRAFT'
    },
    dueDate: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    totalAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true
    },
    currency: {
      type: DataTypes.STRING,
      defaultValue: 'USD'
    }
  }, {
    tableName: 'invoices',
    timestamps: true
  });

  return Invoice;
};

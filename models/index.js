// models/index.js
const sequelize = require('../config/sequelize');

const UserModel = require('./User');
const InvoiceModel = require('./Invoice');
const PaymentModel = require('./Payment');
const SubscriptionModel = require('./Subscription');
const BankAccountModel = require('./BankAccount');
const NotificationModel = require('./Notification');

// Initialize models
const User = UserModel(sequelize);
const Invoice = InvoiceModel(sequelize);
const Payment = PaymentModel(sequelize);
const Subscription = SubscriptionModel(sequelize);
const BankAccount = BankAccountModel(sequelize);
const Notification = NotificationModel(sequelize);

// Define associations in a separate function
const defineAssociations = () => {
  User.hasMany(Invoice, { foreignKey: 'userId' });
  Invoice.belongsTo(User, { foreignKey: 'userId' });

  User.hasMany(Payment, { foreignKey: 'userId' });
  Payment.belongsTo(User, { foreignKey: 'userId' });

  Invoice.hasMany(Payment, { foreignKey: 'invoiceId' });
  Payment.belongsTo(Invoice, { foreignKey: 'invoiceId' });

  User.hasMany(Subscription, { foreignKey: 'userId' });
  Subscription.belongsTo(User, { foreignKey: 'userId' });

  User.hasMany(BankAccount, { foreignKey: 'userId' });
  BankAccount.belongsTo(User, { foreignKey: 'userId' });

  User.hasMany(Notification, { foreignKey: 'userId' });
  Notification.belongsTo(User, { foreignKey: 'userId' });
};

// Export before defining associations
module.exports = {
  sequelize,
  User,
  Invoice,
  Payment,
  Subscription,
  BankAccount,
  Notification,
  defineAssociations
};

// Call associations after export
defineAssociations();
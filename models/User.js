// models/User.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const User = sequelize.define('User', {
    // Primary key
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true
    },
    cognitoSub: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true  // ensures each Cognito user is unique
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: true
    },
    role: {
      type: DataTypes.ENUM('USER', 'ADMIN'),  // or store as string if you prefer
      defaultValue: 'USER'
    }
  }, {
    tableName: 'users',
    timestamps: true
  });

  return User;
};

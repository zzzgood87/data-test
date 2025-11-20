const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Customer = sequelize.define('Customer', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    code: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
      comment: '고객 코드 (username-YY-0001 형식)'
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    phone_primary: {
      type: DataTypes.STRING(20),
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    phone_secondary: {
      type: DataTypes.STRING(20)
    },
    email: {
      type: DataTypes.STRING(100),
      validate: {
        isEmail: true
      }
    },
    address: {
      type: DataTypes.TEXT
    },
    memo: {
      type: DataTypes.TEXT
    },
    status: {
      type: DataTypes.ENUM('active', 'inactive'),
      defaultValue: 'active'
    },
    contact_management: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      comment: 'Contact 관리 ON/OFF'
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    }
  }, {
    tableName: 'customers',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
      { fields: ['user_id'] },
      { fields: ['status'] },
      { fields: ['code'], unique: true }
    ]
  });

  Customer.associate = (models) => {
    Customer.belongsTo(models.User, {
      foreignKey: 'user_id',
      as: 'user'
    });
    Customer.hasOne(models.ContactSchedule, {
      foreignKey: 'customer_id',
      as: 'contact_schedule'
    });
    Customer.hasMany(models.ContactHistory, {
      foreignKey: 'customer_id',
      as: 'contact_histories'
    });
  };

  return Customer;
};

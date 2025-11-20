const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    username: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: true,
        len: [3, 50]
      }
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    email: {
      type: DataTypes.STRING(100),
      validate: {
        isEmail: true
      }
    },
    role: {
      type: DataTypes.ENUM('admin', 'team_leader', 'user'),
      defaultValue: 'user'
    }
  }, {
    tableName: 'users',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  User.associate = (models) => {
    User.hasMany(models.Customer, {
      foreignKey: 'user_id',
      as: 'customers'
    });
    User.hasMany(models.Todo, {
      foreignKey: 'user_id',
      as: 'todos'
    });
    User.hasMany(models.Statistic, {
      foreignKey: 'user_id',
      as: 'statistics'
    });
    User.hasMany(models.ContactHistory, {
      foreignKey: 'created_by',
      as: 'contact_histories'
    });
  };

  return User;
};

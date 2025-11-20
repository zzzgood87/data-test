const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Todo = sequelize.define('Todo', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      comment: '할 일 날짜'
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: true
      },
      comment: '할 일 내용'
    },
    is_completed: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      comment: '완료 여부'
    },
    priority: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      comment: '우선순위 (0이 가장 높음)'
    }
  }, {
    tableName: 'todos',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
      { fields: ['user_id'] },
      { fields: ['date'] },
      { fields: ['is_completed'] }
    ]
  });

  Todo.associate = (models) => {
    Todo.belongsTo(models.User, {
      foreignKey: 'user_id',
      as: 'user'
    });
  };

  return Todo;
};

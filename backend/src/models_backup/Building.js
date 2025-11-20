const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Building = sequelize.define('Building', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  address: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  latitude: {
    type: DataTypes.DECIMAL(10, 8),
    allowNull: false
  },
  longitude: {
    type: DataTypes.DECIMAL(11, 8),
    allowNull: false
  },
  buildingType: {
    type: DataTypes.ENUM('일반건축물', '집합건축물', '토지'),
    allowNull: false,
    defaultValue: '일반건축물'
  },
  totalFloors: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  constructionYear: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  totalArea: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
    comment: '연면적 (㎡)'
  },
  landArea: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
    comment: '대지면적 (㎡)'
  },
  parkingSpaces: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  images: {
    type: DataTypes.TEXT,
    allowNull: true,
    get() {
      const rawValue = this.getDataValue('images');
      return rawValue ? JSON.parse(rawValue) : [];
    },
    set(value) {
      this.setDataValue('images', JSON.stringify(value));
    }
  },
  status: {
    type: DataTypes.ENUM('정상', '매물', '계획', '공사중', '폐쇄'),
    defaultValue: '정상'
  },
  registeredBy: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'Users',
      key: 'id'
    }
  }
}, {
  timestamps: true
});

module.exports = Building;

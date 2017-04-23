'use strict';
module.exports = function(sequelize, DataTypes) {
  var Restaurant = sequelize.define('Restaurant', {
    name: {type: DataTypes.STRING, allowNull: false},
    phoneNumber: {type: DataTypes.STRING, allowNull: false},
    lat: {type: DataTypes.FLOAT, allowNull: false},
    lng: {type: DataTypes.FLOAT, allowNull: false},
    address: {type: DataTypes.STRING, allowNull: false},
    type: {type: DataTypes.ARRAY(DataTypes.STRING)},
    website: DataTypes.STRING,
    openTime: DataTypes.INTEGER,
    closeTime: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
        Restaurant.hasMany(models.Photo);
        Restaurant.hasMany(models.Comment);
      }
    }
  });
  return Restaurant;
};

'use strict';
module.exports = function(sequelize, DataTypes) {
  var Restaurant = sequelize.define('Restaurant', {
    id: {type: DataTypes.STRING, primaryKey: true},
    name: {type: DataTypes.STRING, allowNull: false},
    phoneNumber: {type: DataTypes.STRING, allowNull: false},
    lat: {type: DataTypes.FLOAT, allowNull: false},
    lng: {type: DataTypes.FLOAT, allowNull: false},
    address: {type: DataTypes.STRING, allowNull: false},
    type: {type: DataTypes.ARRAY(DataTypes.STRING)},
    hours: {type: DataTypes.STRING}
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

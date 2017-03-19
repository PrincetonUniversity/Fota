'use strict';
module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define('User', {
    adj: {type: DataTypes.STRING, allowNull: false},
    noun: {type: DataTypes.STRING, allowNull: false},
    count: {type: DataTypes.INTEGER, defaultValue: 0},
    likedPhotos: {type: DataTypes.ARRAY(DataTypes.INTEGER)}
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
        User.hasMany(models.Photo);
      }
    }
  });
  return User;
};

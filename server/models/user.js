'use strict';
module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define('User', {
    id: {type: DataTypes.STRING, primaryKey: true, allowNull: false},
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

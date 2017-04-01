'use strict';
module.exports = function(sequelize, DataTypes) {
  var Photo = sequelize.define('Photo', {
    link: {type: DataTypes.STRING, allowNull: false},
    likecount: {type: DataTypes.INTEGER, allowNull: false, defaultValue: 0}

  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
        Photo.belongsTo(models.Restaurant);
        Photo.belongsTo(models.User)
      }
    }
  });
  return Photo;
};

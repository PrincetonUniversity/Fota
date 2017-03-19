'use strict';
module.exports = function(sequelize, DataTypes) {
  var Comment = sequelize.define('Comment', {
    adj: {type: DataTypes.STRING, allowNull: false},
    noun: {type: DataTypes.STRING, allowNull: false},
    count: {type: DataTypes.INTEGER, defaultValue: 0},
    users: {type: DataTypes.ARRAY(DataTypes.INTEGER)}
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
        Comment.belongsTo(models.Restaurant);
      }
    }
  });
  return Comment;
};

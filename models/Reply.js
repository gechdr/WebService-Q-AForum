const Sequelize = require("sequelize");
const { Model, DataTypes, Op } = require("sequelize");
const sequelize = new Sequelize("t4_6958", "root", "", {
	host: "localhost",
	dialect: "mysql",
	logging: false,
});

class Reply extends Model {}

Reply.init(
	{
		reply_id: {
			type: DataTypes.STRING(4),
			primaryKey: true,
			allowNull: false,
		},
		post_id: {
			type: DataTypes.STRING(4),
			allowNull: false,
		},
		user_id: {
			type: DataTypes.STRING(4),
			allowNull: false,
		},
		title: {
			type: DataTypes.STRING(50),
			allowNull: true
		},
		content: {
			type: DataTypes.STRING(250),
			allowNull: false,
		},
		created_at: {
			type: DataTypes.STRING(30),
			allowNull: false,
		},
    updated_at: {
      type: DataTypes.STRING(30),
      allowNull: true,
    }
	},
	{
		sequelize,
		timestamps: false,
		modelName: "Reply",
		tableName: "replies",
	}
);

module.exports = Reply;
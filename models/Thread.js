const Sequelize = require("sequelize");
const { Model, DataTypes, Op } = require("sequelize");
const sequelize = new Sequelize("t4_6958", "root", "", {
	host: "localhost",
	dialect: "mysql",
	logging: false,
});

class Thread extends Model {}

Thread.init(
	{
		thread_id: {
			type: DataTypes.STRING(4),
			primaryKey: true,
			allowNull: false,
		},
		user_id: {
			type: DataTypes.STRING(4),
			allowNull: false,
		},
		title: {
			type: DataTypes.STRING(64),
			allowNull: false,
		},
		content: {
			type: DataTypes.STRING(250),
			allowNull: false,
		},
		viewers: {
			type: DataTypes.JSON,
			allowNull: false
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
		modelName: "Thread",
		tableName: "threads",
	}
);

module.exports = Thread;
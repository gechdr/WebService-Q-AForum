const Sequelize = require("sequelize");
const { Model, DataTypes, Op } = require("sequelize");
const sequelize = new Sequelize("t4_6958", "root", "", {
	host: "localhost",
	dialect: "mysql",
	logging: false,
});

class User extends Model {}

User.init(
	{
		user_id: {
			type: DataTypes.STRING(4),
			primaryKey: true,
			allowNull: false,
		},
		username: {
			type: DataTypes.STRING(50),
			allowNull: false,
		},
    display_name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
		email: {
			type: DataTypes.STRING(255),
			allowNull: false,
		},
		dob: {
			type: DataTypes.STRING(10),
			allowNull: false,
		},
		phone_number: {
			type: DataTypes.STRING(12),
			allowNull: false,
		},
    bio: {
      type: DataTypes.STRING(255),
      allowNull: false,
    }
	},
	{
		sequelize,
		timestamps: false,
		modelName: "User",
		tableName: "users",
	}
);

module.exports = User;
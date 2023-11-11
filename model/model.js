const { Sequelize, DataTypes } = require('sequelize');
const { config } = require('../config')

const sequelize = new Sequelize(`postgres://${config.db.username}:${config.db.password}@${config.db.server}:${config.db.port}/${config.db.dbName}`)

const Enveloppe = sequelize.define('Enveloppe', {
	id: {
		type: DataTypes.INTEGER,
		autoIncrement: true,
		primaryKey: true
	},
	name: DataTypes.STRING,
	amount: DataTypes.FLOAT,
	parent: DataTypes.INTEGER
});

const Operation = sequelize.define('Operation', {
	id: {
		type: DataTypes.INTEGER,
		autoIncrement: true,
		primaryKey: true
	},
	name: DataTypes.STRING,
	description: DataTypes.STRING,
	amount: DataTypes.FLOAT,
	spendDate: DataTypes.DATE
});

Enveloppe.hasMany(Operation);

sequelize.sync({ alter: true });

module.exports = {
	Enveloppe,
	Operation
}
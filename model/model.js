const { Sequelize, DataTypes, Model } = require('sequelize');
const { config } = require('../config')

const sequelize = new Sequelize(`postgres://${config.db.username}:${config.db.password}@${config.db.server}:${config.db.port}/${config.db.dbName}`)

const Enveloppe = sequelize.define('Enveloppe', {
	id: {
		type: DataTypes.INTEGER,
		autoIncrement: true,
		primaryKey: true
	},
	name: DataTypes.STRING,
	operationAmount: DataTypes.FLOAT,
	childAmount: DataTypes.FLOAT,
	parent: DataTypes.INTEGER,
	initialAmount: DataTypes.FLOAT
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
	spendDate: DataTypes.DATE,
	enveloppeId: DataTypes.INTEGER
});

//sequelize.sync({ force: true });

module.exports = {
	Enveloppe,
	Operation
}
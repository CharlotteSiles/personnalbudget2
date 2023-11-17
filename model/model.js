const { Sequelize, DataTypes, Model } = require('sequelize');
const { config } = require('../config')

const sequelize = new Sequelize(process.env.dbInfos)

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

sequelize.sync();

module.exports = {
	Enveloppe,
	Operation
}

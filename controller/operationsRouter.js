const express = require('express');
const operationsRouter = express.Router();
const { operations } = require('../model/operations');
const { dataValidation } = require('./dataValidation')



operationsRouter.put('/:operationId', async (req, res) => {
	const operationId = dataValidation.validId(req.params.operationId);
	const { name, description, amount, spendDate } = req.body

	const operationToSave = {
		name: dataValidation.validName(name),
		description: dataValidation.validDescription(description),
		amount: dataValidation.validInitialAmount(amount),
		spendDate: dataValidation.validSpendDate(spendDate)
	}

	if (!operationId || !operationToSave.name || !operationToSave.description || !operationToSave.amount || !operationToSave.spendDate) {
		res.status(400).send('Bad request.')
	} else {
		const newOperation = await operations.modifyOperation(operationId, operationToSave)
		
		res.status(200).send(JSON.stringify(newOperation))
	}
});

operationsRouter.delete('/:operationId', async (req, res) => {
	const operationId = dataValidation.validId(req.params.operationId);
	if (!operationId) {
		res.status(400).send('Bad Request')
	} else {
		const operationToDelete = await operations.deleteOperation(operationId)
		
		if(operationToDelete) {
			res.status(204).send(JSON.stringify('No content. Operation successfully deleted'));
		} else {
			res.status(500).send('Internal Error')
		}
	}
});

module.exports = { operationsRouter }
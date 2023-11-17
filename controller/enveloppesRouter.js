const express = require('express');
const enveloppesRouter = express.Router();
const { enveloppes } = require('../model/enveloppes')
const { operations } = require('../model/operations')
const { dataValidation } = require('./dataValidation')

enveloppesRouter.get('/', async (req, res) => {
	
	// input validations

	const allEnveloppes = await enveloppes.getAllEnveloppes()
	res.status(200).send(JSON.stringify(allEnveloppes))
});

enveloppesRouter.post('/', async (req, res) => {
	let { name, initialAmount, parent } = req.body
	
	name = dataValidation.validName(name)
	initialAmount = dataValidation.validInitialAmount(initialAmount)
	parent = dataValidation.validParent(parent)

	const createdEnveloppe = await enveloppes.createEnveloppe({ 
		name, 
		initialAmount,
		parent
	});
	
	if (createdEnveloppe) {
		res.status(201).send(JSON.stringify({ 
			id: createdEnveloppe.id, 
			name: createdEnveloppe.name, 
			initialAmount: createdEnveloppe.initialAmount,
			parent: createdEnveloppe.parent
		}));
	} else {
		res.status(400).send('Bad request. You need to send JSON { "name": "stringName", "initialAmount": "numberAmount", "parent": "parent" }');
	}
});

enveloppesRouter.get('/:enveloppeId', async (req, res) => {
	const enveloppeId = dataValidation.validId(req.params.enveloppeId);

	if (enveloppeId) {
		const oneEnveloppe = await enveloppes.getEnveloppeById(enveloppeId);
		
		res.status(200).send(JSON.stringify(oneEnveloppe));
	} else {
		res.status(400).send('Bad request. The enveloppe id have to be a number greater than 0 in request url : \'/enveloppes/enveloppeId\'');
	}
});

enveloppesRouter.put('/:enveloppeId', async (req, res) => {
	const enveloppeId = dataValidation.validId(req.params.enveloppeId);

	if (enveloppeId) {
		const { name, initialAmount, parent } = req.body
		const updatedEnveloppe = await enveloppes.updateEnveloppe(enveloppeId, { name: name, initialAmount: initialAmount, parent: parent })
		if (updatedEnveloppe) {
			res.status(201).send(JSON.stringify(updatedEnveloppe));
		} else {
			res.status(400).send('Bad request. You need to send JSON { "name": "stringName", "initialAmount": "numberAmount", "parent": "parent" }');
		}
	} else {
		res.status(400).send('Bad request. The enveloppe id have to be a number greater than 0 in request url : \'/enveloppes/enveloppeId\'');
	}
});

enveloppesRouter.delete('/:enveloppeId', async (req, res) => {
	const enveloppeId = dataValidation.validId(req.params.enveloppeId);

	if (enveloppeId) {
		const oneEnveloppe = await enveloppes.deleteEnveloppe(enveloppeId);

		res.status(204).send(JSON.stringify('No content. Enveloppe successfully deleted'));
	} else {
		res.status(400).send('Bad request. The enveloppe id have to be a number greater than 0 in request url : \'/enveloppes/enveloppeId\'');
	}
});

enveloppesRouter.get('/:enveloppeId/operations', async (req, res) => {
	const enveloppeId = dataValidation.validId(req.params.enveloppeId);
	
	if (enveloppeId) {
		const oneEnveloppe = await enveloppes.getEnveloppeById(enveloppeId);
		const enveloppeOperations = await operations.getOperations(enveloppeId)

		const responseJSON = { 
			id: oneEnveloppe.id, 
			name: oneEnveloppe.name, 
			initialAmount: oneEnveloppe.initialAmount,
			operationsAmount: oneEnveloppe.operationAmount,
			childAmount: oneEnveloppe.childAmount,
			operations: []
		}

		for(let op = 0; op < enveloppeOperations.length; op++) {
			responseJSON.operations[op] = {
				id: enveloppeOperations[op].id,
				name: enveloppeOperations[op].name,
				description: enveloppeOperations[op].description,
				amount: enveloppeOperations[op].amount,
				spendDate: enveloppeOperations[op].spendDate
			}
		}
		
		res.status(200).send(JSON.stringify(responseJSON));
	} else {
		res.status(400).send('Bad request. The enveloppe id have to be a number greater than 0 in request url : \'/enveloppes/enveloppeId\'');
	}
});

enveloppesRouter.post('/:enveloppeId/operations', async (req, res) => {
	let { name, description, amount, spendDate } = req.body
	
	name = dataValidation.validName(name)
	description = dataValidation.validDescription(description)
	amount = dataValidation.validInitialAmount(amount)
	console.log(typeof spendDate)
	spendDate = dataValidation.validSpendDate(spendDate)
	
	const enveloppeId = dataValidation.validId(req.params.enveloppeId);
	
	if (!enveloppeId || !name || !description || !amount || !spendDate) {
		res.status(400).send('Bad request')
		return;
	}
	
	const newOperation = await operations.createOperation({
		name,
		description,
		amount,
		spendDate,
		enveloppeId
	});
	

	res.status(201).send(JSON.stringify({
		id: newOperation.id,
		name: newOperation.name,
		description: newOperation.description,
		amount: newOperation.amount,
		spendDate: newOperation.spendDate
	}))
});

module.exports = { enveloppesRouter }
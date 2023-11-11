const express = require('express');
const enveloppesRouter = express.Router();
const { enveloppes } = require('../model/enveloppes')
const { operations } = require('../model/operations')

enveloppesRouter.get('/', async (req, res) => {
	
	// input validations

	const allEnveloppes = await enveloppes.getAllEnveloppes()
	res.status(200).send(JSON.stringify(allEnveloppes))
});

enveloppesRouter.post('/', async (req, res) => {
	const { name, initialAmount, parent } = req.body
	const createdEnveloppe = await enveloppes.createEnveloppe({ 
		name, 
		initialAmount,
		parent
	});
	
	if (createdEnveloppe) {
		res.status(201).send(JSON.stringify({ 
			id: createdEnveloppe.id, 
			name: createdEnveloppe.name, 
			amount: createdEnveloppe.initialAmount
		}));
	} else {
		res.status(400).send('Bad request. You need to send JSON { "name": "stringName", "amount": "numberAmount" }');
	}
});

enveloppesRouter.get('/:enveloppeId', async (req, res) => {
	const enveloppeId = Number(req.params.enveloppeId);

	if (Number.isInteger(enveloppeId) && enveloppeId > 0) {
		const oneEnveloppe = await enveloppes.getEnveloppeById(enveloppeId);
		
		res.status(200).send(JSON.stringify(oneEnveloppe));
	} else {
		res.status(400).send('Bad request. The enveloppe id have to be a number greater than 0 in request url : \'/enveloppes/enveloppeId\'');
	}
});

enveloppesRouter.put('/:enveloppeId', async (req, res) => {
	const enveloppeId = Number(req.params.enveloppeId);

	if (Number.isInteger(enveloppeId) && enveloppeId > 0) {
		const { name, initialAmount, parent } = req.body
		const updatedEnveloppe = await enveloppes.updateEnveloppe(enveloppeId, { name: name, initialAmount: initialAmount, parent: parent })
		if (updatedEnveloppe) {
			res.status(201).send(JSON.stringify(updatedEnveloppe));
		} else {
			res.status(400).send('Bad request. You need to send JSON { "name": "stringName", "amount": "numberAmount" }');
		}
	} else {
		res.status(400).send('Bad request. The enveloppe id have to be a number greater than 0 in request url : \'/enveloppes/enveloppeId\'');
	}
});

enveloppesRouter.delete('/:enveloppeId', async (req, res) => {
	const enveloppeId = Number(req.params.enveloppeId);

	if (Number.isInteger(enveloppeId) && enveloppeId > 0) {
		const oneEnveloppe = await enveloppes.deleteEnveloppe(enveloppeId);

		res.status(204).send(JSON.stringify('No content. Enveloppe successfully deleted'));
	} else {
		res.status(400).send('Bad request. The enveloppe id have to be a number greater than 0 in request url : \'/enveloppes/enveloppeId\'');
	}
});

// to review : 
enveloppesRouter.get('/:enveloppeId/operations', async (req, res) => {
	const enveloppeId = Number(req.params.enveloppeId);
	if (Number.isInteger(enveloppeId) && enveloppeId > 0) {
		const oneEnveloppe = await enveloppes.getEnveloppeById(enveloppeId);
		const enveloppeOperations = await operations.getOperations(enveloppeId)

		const responseJSON = { 
			id: oneEnveloppe.id, 
			name: oneEnveloppe.name, 
			amount: oneEnveloppe.amount,
			operations: {}
		}
		
		res.status(200).send(JSON.stringify());
	} else {
		res.status(400).send('Bad request. The enveloppe id have to be a number greater than 0 in request url : \'/enveloppes/enveloppeId\'');
	}
});

enveloppesRouter.post('/:enveloppeId/operations', async (req, res) => {
	const { name, description, amount, spendDate } = req.body
	const enveloppeId = req.params.enveloppeId

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
const express = require('express');
const enveloppesRouter = express.Router();
const { enveloppes } = require('../model/enveloppes')

enveloppesRouter.get('/', async (req, res) => {
	
	const allEnveloppes = await enveloppes.getAllEnveloppes()
	const responseJSON = { enveloppes: [] }

	for (let i = 0; i < allEnveloppes.length; i++) {
		responseJSON.enveloppes[i] = {
			id: allEnveloppes[i].id,
			name: allEnveloppes[i].name,
			amount: allEnveloppes[i].amount,
			parent: allEnveloppes[i].parent
		}
	}

	res.status(200).send(JSON.stringify(responseJSON))
});

enveloppesRouter.post('/', async (req, res) => {
	const { name, amount } = req.body
	const createdEnveloppe = await enveloppes.createEnveloppe({ name: name, amount: amount });
	if (createdEnveloppe) {
		res.status(201).send(JSON.stringify({ id: createdEnveloppe.id, name: createdEnveloppe.name, amount: createdEnveloppe.amount}));
	} else {
		res.status(400).send('Bad request. You need to send JSON { "name": "stringName", "amount": "numberAmount" }');
	}
});

enveloppesRouter.get('/:enveloppeId', async (req, res) => {
	const enveloppeId = Number(req.params.enveloppeId);

	if (Number.isInteger(enveloppeId) && enveloppeId > 0) {
		const oneEnveloppe = await enveloppes.getEnveloppeById(enveloppeId);
		
		res.status(200).send(JSON.stringify({ id: oneEnveloppe.id, name: oneEnveloppe.name, amount: oneEnveloppe.amount }));
	} else {
		res.status(400).send('Bad request. The enveloppe id have to be a number greater than 0 in request url : \'/enveloppes/enveloppeId\'');
	}
});

enveloppesRouter.put('/:enveloppeId', async (req, res) => {
	const enveloppeId = Number(req.params.enveloppeId);

	if (Number.isInteger(enveloppeId) && enveloppeId > 0) {
		const { name, amount, parent } = req.body
		const updatedEnveloppe = await enveloppes.updateEnveloppe(enveloppeId, { name: name, amount: amount, parent: parent })
		if (updatedEnveloppe) {
			res.status(201).send(JSON.stringify({ id: updatedEnveloppe.id, name: updatedEnveloppe.name, amount: updatedEnveloppe.amount }));
		} else {
			res.status(400).send('Bad request. You need to send JSON { "name": "stringName", "amount": "numberAmount" }');
		}
	} else {
		res.status(400).send('Bad request. The enveloppe id have to be a number greater than 0 in request url : \'/enveloppes/enveloppeId\'');
	}
});

enveloppesRouter.delete('/:enveloppeId', (req, res) => {
	const enveloppeId = req.params.enveloppeId;

	if (typeof enveloppeId === 'number' && enveloppeId < 0) {
		const oneEnveloppe = enveloppes.deleteEnveloppe(enveloppeId);

		res.status(204).send(JSON.stringify('No content. Enveloppe successfully deleted'));
	} else {
		res.status(400).send('Bad request. The enveloppe id have to be a number greater than 0 in request url : \'/enveloppes/enveloppeId\'');
	}
});


enveloppesRouter.get('/:enveloppeId/operations', (req, res) => {
	// Send all operations corresponding to on enveloppe (enveloppeId)
});

module.exports = { enveloppesRouter }
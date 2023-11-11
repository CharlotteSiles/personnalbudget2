const express = require('express');
const enveloppesRouter = express.Router();
const { enveloppes } = require('../model/enveloppes')

enveloppesRouter.get('/', (req, res) => {
	
	const allEnveloppes = enveloppes.getAllEnveloppes()
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

enveloppesRouter.post('/', (req, res) => {
	const createdEnveloppe = enveloppes.createEnveloppe(req.body)
	if (createdEnveloppe) {
		res.status(201).send(JSON.stringify(createdEnveloppe));
	} else {
		res.status(400).send('Bad request. You need to send JSON { "name": "stringName", "amount": "numberAmount" }');
	}
});

enveloppesRouter.get('/:enveloppeId', (req, res) => {
	const enveloppeId = req.params.enveloppeId;

	if (typeof enveloppeId === 'number' && enveloppeId < 0) {
		const oneEnveloppe = enveloppes.getEnvloppeById(enveloppeId);

		res.status(200).send(JSON.stringify(oneEnveloppe));
	} else {
		res.status(400).send('Bad request. The enveloppe id have to be a number greater than 0 in request url : \'/enveloppes/enveloppeId\'');
	}
});

enveloppesRouter.put('/:enveloppeId', (req, res) => {
	const enveloppeId = req.params.enveloppeId;

	if (typeof enveloppeId === 'number' && enveloppeId < 0) {
		const updatedEnveloppe = enveloppes.updateEnveloppe(enveloppeId, req.body)
		if (updatedEnveloppe) {
			res.status(201).send(JSON.stringify(updatedEnveloppe));
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
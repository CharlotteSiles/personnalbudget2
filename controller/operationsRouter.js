const express = require('express');
const operationsRouter = express.Router();
const { operations } = require('../model/operations');



operationsRouter.put('/:operationId', async (req, res) => {
	// Modify one existing operation
});

operationsRouter.delete('/:operationId', async (req, res) => {
	// Delete one operation
});

module.exports = { operationsRouter }
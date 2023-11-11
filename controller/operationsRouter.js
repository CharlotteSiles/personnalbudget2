const express = require('express');
const operationsRouter = express.Router();

operationsRouter.get('/', (req, res) => {
	// Send all operations
});

operationsRouter.post('/', (req, res) => {
	// Create new operation
});

operationsRouter.put('/:operationId', (req, res) => {
	// Modify one existing operation
});

operationsRouter.delete('/:operationId', (req, res) => {
	// Delete one operation
});

module.exports = { operationsRouter }
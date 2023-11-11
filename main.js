const express = require('express');
const app = express();
const bodyParser = require('body-parser')

app.use(bodyParser.json())

const { enveloppesRouter } = require('./controller/enveloppesRouter');
app.use('/enveloppes', enveloppesRouter);

const { operationsRouter } = require('./controller/operationsRouter');
app.use('/operations', operationsRouter);

app.listen(3000, () => {
	console.log('App listening ... ');
})



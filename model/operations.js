const { Operation, Enveloppe } = require('./model')

const operations = {
    async getOperations(enveloppeId) {
        const operations = await Operation.findAll({where: {enveloppeId: enveloppeId}})
        console.log(operations)
    },

    async createOperation(operation) {
        const newOperation = await Operation.create({ 
            name: operation.name, 
            description: operation.description,
            amount: operation.amount,
            spendDate: operation.spendDate,
            enveloppeId: operation.enveloppeId
        })

        const enveloppe = await Enveloppe.findOne({where: { id: operation.enveloppeId }})

        enveloppe.amount -= operation.amount
        enveloppe.save()

        return newOperation
    }
}

module.exports = { operations }
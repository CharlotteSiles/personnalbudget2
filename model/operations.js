const { Operation, Enveloppe } = require('./model')

const operations = {
    async getOperations(enveloppeId) {
        const operations = await Operation.findAll({where: {enveloppeId: enveloppeId}})
        return operations
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
        
        enveloppe.operationAmount += operation.amount
        enveloppe.save()

        return newOperation
    },

    async modifyOperation(operationId, newOperation) {
        const oldOperation = await Operation.findOne({where: { id: operationId } })

        if(oldOperation.amount != newOperation.amount) {
            if (newOperation.enveloppeId) {
            
                if (oldOperation.enveloppeId != newOperation.enveloppeId) {
                    const relatedEnveloppe = await Enveloppe.findOne({ where: { id: oldOperation.enveloppeId } })
                    const newRelatedEnveloppe = await Enveloppe.findOne({ where: { id: newOperation.enveloppeId } })


                    relatedEnveloppe.operationAmount -= oldOperation.amount
                    newRelatedEnveloppe.operationAmount += newOperation.amount

                    relatedEnveloppe.save()
                    newRelatedEnveloppe.save()
                } else {
                    const relatedEnveloppe = await Enveloppe.findOne({ where: { id: oldOperation.enveloppeId } })
                    relatedEnveloppe.operationAmount += newOperation.amount - oldOperation.amount
                    relatedEnveloppe.save()
                }
            } else {
                const relatedEnveloppe = await Enveloppe.findOne({ where: { id: oldOperation.enveloppeId } })
                relatedEnveloppe.operationAmount += newOperation.amount - oldOperation.amount
                relatedEnveloppe.save()
            }
        }

        const updatedOperation = await Operation.update({
            name: newOperation.name, 
            description: newOperation.description,
            amount: newOperation.amount,
            spendDate: newOperation.spendDate,
        }, { where: { id: operationId } })

        return newOperation
    },

    async deleteOperation(operationId) {
        const operationToDelete = await Operation.findOne({ where: { id: operationId } })
        operationToDelete.destroy()
        return true
    }
}

module.exports = { operations }
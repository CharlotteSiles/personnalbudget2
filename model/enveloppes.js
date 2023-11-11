const { Enveloppe } = require('./model');

const enveloppes = {
	async getAllEnveloppes() {
		const allEnveloppes =  await Enveloppe.findAll();
		
		for (let i = 0; i < allEnveloppes.length; i++) {
			responseJSON.enveloppes[i] = {
				id: allEnveloppes[i].id,
				name: allEnveloppes[i].name,
				amount: allEnveloppes[i].initialAmount - allEnveloppes[i].operationAmount,
				parent: allEnveloppes[i].parent
			}
		}

		return responseJSON
	},

	async getEnveloppeById(enveloppeId) {
		const enveloppe = await Enveloppe.findOne({ where: { id: enveloppeId } });
		const responseJSON = {
			id: enveloppe.id,
			name: enveloppe.name,
			amount: enveloppe.initialAmount - enveloppe.operationAmount,
			parent: enveloppe.parent
		}
		return responseJSON;
	},

	async createEnveloppe(enveloppe) {
		const enveloppeToCreate = enveloppe
		const parentEnveloppe = await Enveloppe.findOne({ where: { id: enveloppeToCreate.parent } });

		if (parentEnveloppe.operationAmount) {
			parentEnveloppe.operationAmount -= enveloppeToCreate.initialAmount
		} else {
			parentEnveloppe.operationAmount = enveloppeToCreate.initialAmount
		}
		parentEnveloppe.save()

		const createdEnveloppe = await Enveloppe.create({
			name: enveloppeToCreate.name,
			initialAmount: enveloppeToCreate.initialAmount,
			operationAmount: 0,
			parent: enveloppeToCreate.parent ? enveloppeToCreate.parent : 0
		});

		return {
			id: createdEnveloppe.id,
			name: createdEnveloppe.name,
			amount: createdEnveloppe.initialAmount - createdEnveloppe.operationAmount,
			parent: createdEnveloppe.parent
		}
	},

	async updateEnveloppe(enveloppeId, enveloppe) {

		const enveloppeToUpdate = Enveloppe.findOne({ where: { id: enveloppeId } });

		if (enveloppeToUpdate) {

			if (enveloppeToUpdate.parent > 0 && enveloppeToUpdate.initialAmount != enveloppe.initialAmount) {
				const parentEnveloppe = await Enveloppe.findOne({ where: { id: enveloppeToUpdate.parent } })

				if (enveloppeToUpdate.parent != enveloppe.parent) {
					parentEnveloppe.operationAmount += enveloppeToUpdate.initialAmount
					const newParent = await Enveloppe.findOne({where: {id: enveloppe.parent}})
					newParent.operationAmount -= enveloppe.initialAmount
					newParent.save()

				} else {
					parentEnveloppe += enveloppeToUpdate.initialAmount - enveloppe.initialAmount
				}
				parentEnveloppe.save()
			}
					
			await Enveloppe.update({ 
				name: enveloppe.name, 
				initialAmount: enveloppe.initialAmount, 
				parent: enveloppe.parent 
			}, { 
				where: { 
					id: enveloppeId 
				} 
			})
			
			return { 
				id: enveloppeId, 
				name: enveloppe.name, 
				amount: enveloppe.initialAmount - enveloppeToUpdate.operationAmount, 
				parent: enveloppe.parent
			};
			
		}
		return false;
	},

	async deleteEnveloppe(enveloppeId) {
		const enveloppeToDelete = await Enveloppe.findOne({ where: { id: enveloppeId } })

		if (enveloppeToDelete.parent != 0) {
			const parentEnveloppe = await Enveloppe.findOne({ where: { id: enveloppeToDelete.parent }});
			parentEnveloppe.operationAmount += enveloppeToDelete.initialAmount
			parentEnveloppe.save()
		}
		
		enveloppeToDelete.destroy();
		return true;
	},
}

module.exports = { enveloppes }
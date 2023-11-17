const { Enveloppe } = require('./model');

const enveloppes = {
	async getAllEnveloppes() {
		const allEnveloppes =  await Enveloppe.findAll();
		const responseJSON = {
			enveloppes: []
		}

		for (let i = 0; i < allEnveloppes.length; i++) {
			responseJSON.enveloppes[i] = {
				id: allEnveloppes[i].id,
				name: allEnveloppes[i].name,
				initialAmount: allEnveloppes[i].initialAmount,
				childAmount: allEnveloppes[i].childAmount,
				operationAmount: allEnveloppes[i].operationAmount,
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
			initialAmount: enveloppe.initialAmount,
			childAmount: enveloppe.childAmount,
			operationAmount: enveloppe.operationAmount,
			parent: enveloppe.parent
		}
		return responseJSON;
	},

	async createEnveloppe(enveloppe) {
		const enveloppeToCreate = enveloppe
		const parentEnveloppe = await Enveloppe.findOne({ where: { id: enveloppeToCreate.parent } });

		if (parentEnveloppe) {
			if (parentEnveloppe.childAmount){
				parentEnveloppe.childAmount -= enveloppeToCreate.initialAmount
			} else {
				parentEnveloppe.childAmount = enveloppeToCreate.initialAmount
			}

			parentEnveloppe.save()
		}
		

		const createdEnveloppe = await Enveloppe.create({
			name: enveloppeToCreate.name,
			initialAmount: enveloppeToCreate.initialAmount,
			operationAmount: 0,
			childAmount: 0,
			parent: enveloppeToCreate.parent ? enveloppeToCreate.parent : 0
		});

		return {
			id: createdEnveloppe.id,
			name: createdEnveloppe.name,
			initialAmount: createdEnveloppe.initialAmount,
			operationAmount: createdEnveloppe.operationAmount,
			parent: createdEnveloppe.parent
		}
	},

	async updateEnveloppe(enveloppeId, enveloppe) {

		const enveloppeToUpdate = await Enveloppe.findOne({ where: { id: enveloppeId } });

		if (enveloppeToUpdate) {

			if (enveloppeToUpdate.parent > 0 && enveloppeToUpdate.initialAmount != enveloppe.initialAmount) {
				const parentEnveloppe = await Enveloppe.findOne({ where: { id: enveloppeToUpdate.parent } })
				console.log(enveloppe.parent)
				if (enveloppe.parent) {
					if (enveloppeToUpdate.parent != enveloppe.parent) {
						parentEnveloppe.childAmount += enveloppeToUpdate.initialAmount
						const newParent = await Enveloppe.findOne({where: {id: enveloppe.parent}})
						newParent.childAmount -= enveloppe.initialAmount
						newParent.save()
					}

				} else {
					parentEnveloppe.childAmount += enveloppe.initialAmount - enveloppeToUpdate.initialAmount
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
				initialAmount: enveloppe.initialAmount, 
				parent: enveloppe.parent
			};
			
		}
		return false;
	},

	async deleteEnveloppe(enveloppeId) {
		const enveloppeToDelete = await Enveloppe.findOne({ where: { id: enveloppeId } })

		if (enveloppeToDelete.parent != 0) {
			const parentEnveloppe = await Enveloppe.findOne({ where: { id: enveloppeToDelete.parent }});
			parentEnveloppe.childAmount -= enveloppeToDelete.initialAmount
			parentEnveloppe.save()
		}
		
		enveloppeToDelete.destroy();
		return true;
	},
}

module.exports = { enveloppes }
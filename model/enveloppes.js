const { Enveloppe } = require('./model');

const enveloppes = {
	async getAllEnveloppes() {
		return await Enveloppe.findAll();
	},

	async getEnveloppeById(enveloppeId) {
		const enveloppe = await Enveloppe.findOne({ where: { id: enveloppeId } });
		return enveloppe;
	},

	async createEnveloppe(enveloppe) {
		if (enveloppe.name && enveloppe.amount) {
			if (typeof enveloppe.name === 'string' && typeof enveloppe.amount === 'number') {
				return await Enveloppe.create(enveloppe);
			} else {
				return false;
			}
		} else {
			return false;
		}
	},

	async updateEnveloppe(enveloppeId, enveloppe) {

		const enveloppeToUpdate = Enveloppe.findOne({ where: { id: enveloppeId } });

		if (enveloppeToUpdate) {
			if (enveloppe.name && enveloppe.amount) {
				if (typeof enveloppe.name === 'string' && typeof enveloppe.amount === 'number') {
					
					await Enveloppe.update({ name: enveloppe.name, amount: enveloppe.amount, parent: enveloppe.parent }, { where: { id: enveloppeId } })
					
					return { 
						id: enveloppeId, 
						name: enveloppe.name, 
						amount: enveloppe.amount, 
						parent: enveloppe.parent
					};
				}
			}
		}
		return false;
	},

	async deleteEnveloppe(enveloppeId) {
		const enveloppeToDelete = Enveloppe.findOne({ where: { id: enveloppeId } })
		enveloppeToDelete.destroy();
		return true;
	},
}

module.exports = { enveloppes }
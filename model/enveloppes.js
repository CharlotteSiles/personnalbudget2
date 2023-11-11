const { Enveloppe } = require('./model');

const enveloppes = {
	async getAllEnveloppes() {
		return await Enveloppe.findAll();
	},

	async getEnveloppeById(enveloppeId) {
		return await Enveloppe.findOne({ where: { id: enveloppeId } });
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
					enveloppeToUpdate.name = enveloppe.name;
					enveloppeToUpdate.amount = enveloppe.amount;

					enveloppeToUpdate.save();

					return enveloppeToUpdate;
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
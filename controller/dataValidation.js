const dataValidation = {
    validName(name) {
        if (typeof name === 'string') {
            if (name.length <= 256) {
                return name
            }
        }
        return false
    },

    validInitialAmount(initialAmount) {
        const amount = Number(initialAmount);
        if (Number.isSafeInteger(amount)) {
            if (amount >= 0){
                return amount
            }
        }

        return false
    },

    validParent(parentEnveloppe) {
        const parent = Number(parentEnveloppe)
        if (Number.isSafeInteger(parent)) {
            if (parent >= 0) {
                return parent
            }
        }
        return false
    },

    validId(id) {
        const numberId = Number(id)
        if (Number.isSafeInteger(numberId)) {
            if (numberId >= 0) {
                return numberId
            }
        }
        return false
    },

    validDescription(description) {
        if (typeof description === 'string') {
            return description
        }
        return false
    },

    validSpendDate(spendDate) {
        if (typeof spendDate === 'object') {
            if (spendDate.year && spendDate.month && spendDate.day) {
                spendDate = new Date(`${spendDate.month}/${spendDate.day}/${spendDate.year}`)
                return spendDate
            }
        }
        return false
    }
}

module.exports = { dataValidation }
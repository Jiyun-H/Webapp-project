const mongoose = require('mongoose');

const purchaseSchema = new mongoose.Schema({
    amount: {
        type: Number,
        required: true,
    },
    coupons: {
        type: Number,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now,
    },
});

const Purchase = mongoose.model('Purchase', purchaseSchema);

module.exports = Purchase;
const mongoose = require('mongoose');

const discountSchema = new mongoose.Schema({
    description: String,
    value: Number
});

module.exports = mongoose.model('Discount', discountSchema);

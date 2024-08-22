const Discount = require('../models/discountModel');

exports.getDiscounts = async (req, res) => {
    const discounts = await Discount.find();
    res.json(discounts);
};

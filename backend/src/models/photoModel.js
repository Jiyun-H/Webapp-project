const mongoose = require('mongoose');

const photoSchema = new mongoose.Schema({
    restaurantOwnerId: { type: mongoose.Schema.Types.ObjectId, ref: 'RestaurantOwner', required: true },
    image: { type: String, required: true },
    imageType: { type: String, required: false }
}, { collection: 'photos' });

const Photo = mongoose.model('Photo', photoSchema);
module.exports = Photo;

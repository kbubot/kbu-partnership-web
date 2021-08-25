const mongoose = require('mongoose');

const PartnerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String },
  benefit: { type: String },
  latitude: { type: Number },
  longitude: { type: Number },
  imageId: {type: mongoose.Types.ObjectId}
}, { timestamps: true })

module.exports = mongoose.model('partner', PartnerSchema);
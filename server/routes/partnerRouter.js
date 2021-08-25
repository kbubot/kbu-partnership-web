const { Router } = require('express');
const partnerRouter = Router();
const Partner = require('../models/Partner');

partnerRouter.put('/', async (req, res) => {
  try{
    let partner = await Partner.findOne({imageId: req.body.imageId});
    const updateableData = {
        name: req.body.name,
        category: req.body.category,
        benefit: req.body.benefit,
        latitude: req.body.latitude,
        longitude: req.body.longitude,
        imageId: req.body.imageId
    }
    if(!partner)
      partner = await new Partner(updateableData).save();
    else
      partner = await Partner.updateOne(updateableData);
    res.json(partner);
  }catch(err){
    res.status(400).json({message: err.message});
  }
});

partnerRouter.get('/:imageId', async (req, res) => {
  try{
    const partner = await Partner.findOne({imageId: req.params.imageId});
    res.json(partner);
  }catch(err){
    res.status(400).json({message: err.message});
  }
});

module.exports = { partnerRouter };
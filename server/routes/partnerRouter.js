const { Router } = require('express');
const partnerRouter = Router();
const axios = require('axios');
require('dotenv').config();

const Partner = require('../models/Partner');
const Image = require('../models/Image');

PRODUCTION_URL = process.env.ELK_DOMAIN + "/partners/_search"
DEV_URL = "http://localhost:9200/partners/_search"


partnerRouter.put('/', async (req, res) => {
  try {
    let partner = await Partner.findOne({ imageId: req.body.imageId });
    const updateableData = {
      name: req.body.name,
      category: req.body.category,
      benefit: req.body.benefit,
      latitude: req.body.latitude,
      longitude: req.body.longitude,
      imageId: req.body.imageId
    }
    if (!partner)
      partner = await new Partner(updateableData).save();
    else
      partner = await Partner.updateOne(updateableData);
    res.json(partner);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

partnerRouter.get('/:imageId', async (req, res) => {
  try {
    const partner = await Partner.findOne({ imageId: req.params.imageId });
    res.json(partner);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

partnerRouter.get('/search/:keyword', async (req, res) => {
  const { keyword } = req.params;
  await axios.get(DEV_URL, {
    headers: { "Content-Type": "application/json" },
    data: {
      "query": {
        "bool": {
          "should": [
            {
              "match": { "category": keyword }
            },
            {
              "match": { "name": keyword }
            },
            {
              "match": { "benefit.nori": keyword }
            }
          ]
        }
      }
    }
  })
    .then(async elasticResult => {
      const imageIdList = elasticResult.data.hits.hits.map(
        hit => hit._source.imageId
      );
      const images = await Image.find(
        {
          _id: imageIdList
        });
      const result = {};
      images.forEach(image => result[image.id] = image);
      res.json(result);
    })
    .catch(err => {
      res.status(500).json({ message: err.message });
    })
});
module.exports = { partnerRouter };
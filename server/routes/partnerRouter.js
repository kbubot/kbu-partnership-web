const { Router } = require('express');
const partnerRouter = Router();
const axios = require('axios');
require('dotenv').config();

const Partner = require('../models/Partner');
const Image = require('../models/Image');

PRODUCTION_URL = process.env.ELK_DOMAIN + "/partners/_search"
DEV_URL = "http://localhost:9200/partners_deli/_search"
UNIV_COORD = { "lat": 37.64894385920717, "lon": 127.06431989717667 }

partnerRouter.put('/info', async (req, res) => {
  try {
    let partner = await Partner.findOne({ imageId: req.body.imageId });
    const updateableData = {
      name: req.body.name,
      category: req.body.category,
      benefit: req.body.benefit,
      location: {
        lat: req.body.latitude,
        lon: req.body.longitude,
      },
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
partnerRouter.get('/info/:imageId', async (req, res) => {
  const { imageId } = req.params;
  if (!imageId)
    res.status(204).json({ message: "parameter is undefined" })
  try {
    const partner = await Partner.findOne({ imageId: imageId });
    res.json(partner);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});
partnerRouter.get('/search', async (req, res) => {
  const { keyword, near, ispublic } = req.query;
  let data = { "query": { "bool": {} } }
  if (keyword.match(/[\d]+원|\d{1,2}[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]원?/))
    data.query.bool.must = [
      { "match": { "benefit.deli": keyword } }
    ]
  else if (keyword && !near) {
    data.query.bool.should = [
      { "match": { "category": keyword } },
      { "match": { "name": keyword } },
      { "match": { "benefit.nori": keyword } }
    ]
    data.size = 30;
  }
  else if (!keyword && near)
    data.query.bool.filter = {
      "geo_distance": {
        "distance": "1km",
        "location": UNIV_COORD
      }
    };

  await axios.get(DEV_URL, {
    headers: { "Content-Type": "application/json" },
    data: data
  })
    .then(async elasticResult => {
      const imageIdList = elasticResult.data.hits.hits.map(
        hit => hit._source.imageId
      );
      const images = await Image.find(
        {
          _id: imageIdList,
          public: ispublic
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
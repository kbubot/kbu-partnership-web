require('dotenv').config();
const { Router } = require('express');
const path = require('path');
const axios = require('axios');
const sharp = require('sharp');

const Partner = require('../models/Partner');
const Image = require('../models/Image');
const upload = require('../middleware/imageUpload');
const { RESIZE_VALUE, UNIV_COORD } = require('../utils/dummyData');

const partnerRouter = Router();

PRODUCTION_URL = process.env.ELK_DOMAIN + "/partners_deli/_search"
DEV_URL = "http://localhost:9200/partners_deli/_search"

partnerRouter.post('/info', upload.single("image"), async (req, res) => {
  try {
    if (!req.user)
      throw new Error("권한이 없습니다.");
    const image = await new Image({
      user: {
        _id: req.user.id,
        name: req.user.name,
        username: req.user.username,
      },
      public: req.body.public,
      key: req.file.filename,
      originalFileName: req.file.originalname
    }).save();
    await new Partner({
      name: req.body.name,
      category: req.body.category,
      benefit: req.body.benefit,
      location: {
        lat: req.body.latitude,
        lon: req.body.longitude,
      },
      imageId: image._id
    }).save();
    RESIZE_VALUE.map(async ({ name, width }) => {
      try {
        const keyOnly = req.file.path.split(path.sep)[2];
        const newKey = `${name}/${keyOnly}`;
        await sharp(req.file.path)
          .rotate()
          .resize({ width, height: width, fit: "outside" })
          .toFile(`./uploads/${newKey}`);
      } catch (err) {
        throw err;
      }
    });
    const result = {};
    result[image._id] = image;
    res.json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});
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
  if (keyword && keyword === keyword.match(/[\d]+원|[\d{1,2}]?[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]원?/)[0]) {
    data.query.bool.must = [
      { "match": { "benefit.deli": keyword } }
    ]
  }
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

  await axios.get(PRODUCTION_URL, {
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
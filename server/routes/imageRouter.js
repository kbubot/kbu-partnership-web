const { Router } = require("express");
const imageRouter = Router();
const Image = require('../models/Image');
const upload = require('../middleware/imageUpload');
const fs = require("fs");
const { promisify } = require("util");
const mongoose = require('mongoose');
const sharp = require('sharp');

const fileUnlink = promisify(fs.unlink);

const transformationOptions = [
  { name: 'w140', width: 140 },
  { name: 'w600', width: 600 },
]

imageRouter.post('/', upload.array("image", 5), async (req, res) => {
  try {
    if (!req.user)
      throw new Error("권한이 없습니다.");
    const images = await Promise.all(
      req.files.map(async file => {
        const image = await new Image({
          user: {
            _id: req.user.id,
            name: req.user.name,
            username: req.user.username,
          },
          public: req.body.public,
          key: file.filename,
          originalFileName: file.originalname
        }).save();

        transformationOptions.map(async ({ name, width }) => {
          try {
            const keyOnly = file.path.split("\\")[1];
            console.log(`Image Resizing: ${keyOnly}`);
            const newKey = `${name}/${keyOnly}`
            await sharp(file.path)
              .rotate()
              .resize({ width, height: width, fit: "outside" })
              .toFile(`./uploads/${newKey}`);
          } catch (err) {
            throw err;
          }
        });
        return image
      })
    );
    res.json(images);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});
imageRouter.get("/", async (req, res) => {
  try {
    const { lastid } = req.query;
    if (lastid && !mongoose.isValidObjectId(lastid))
      throw new Error("invalid lastid");
    const images = await Image.find(
      lastid ?
        {
          public: true,
          _id: { $lt: lastid }
        } :
        { public: true, }
    ).sort({ _id: -1 }).limit(8);
    res.json(images);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});
imageRouter.get("/:imageId", async (req, res) => {
  try {
    const { imageId } = req.params;
    if (!mongoose.isValidObjectId(imageId))
      throw new Error("올바르지 않은 이미지id입니다.");
    const image = await Image.findOne({ _id: imageId });
    if (!image)
      throw new Error("해당 이미지는 존재 하지 않습니다.");
    if (!image.public
      && (!req.user || req.user.id.toString() !== image.user._id.toString()))
      throw new Error("권한이 없습니다.");
    res.json(image);
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: err.message });
  }
});
imageRouter.delete("/:imageId", async (req, res) => {
  try {
    if (!req.user)
      throw new Error("권한이 없습니다.");
    if (!mongoose.isValidObjectId(req.params.imageId))
      throw new Error("올바르지 않은 이미지id입니다.");
    const image = await Image.findOneAndDelete({ _id: req.params.imageId });
    if (!image)
      return res.json({ message: "요청하신 이미지는 이미 삭제되었습니다." });
    await fileUnlink(`./uploads/${image.key}`);
    res.json({ message: "요청하신 이미지가 삭제되었습니다.", image });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});
imageRouter.patch("/:imageId/like", async (req, res) => {
  try {
    if (!req.user)
      throw new Error("권한이 없습니다.");
    if (!mongoose.isValidObjectId(req.params.imageId))
      throw new Error("올바르지 않은 이미지id입니다.");
    const image = await Image.findOneAndUpdate(
      { _id: req.params.imageId },
      { $addToSet: { likes: req.user.id } },
      { new: true }
    );
    res.json(image);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});
imageRouter.patch("/:imageId/unlike", async (req, res) => {
  try {
    if (!req.user)
      throw new Error("권한이 없습니다.");
    if (!mongoose.isValidObjectId(req.params.imageId))
      throw new Error("올바르지 않은 이미지id입니다.");
    const image = await Image.findOneAndUpdate(
      { _id: req.params.imageId },
      { $pull: { likes: req.user.id } },
      { new: true }
    );
    res.json(image);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }

});

module.exports = { imageRouter };
const { Router } = require("express");
const mongoose = require('mongoose');
const path = require('path');
const fs = require("fs");
const { promisify } = require("util");
const sharp = require('sharp');

const Image = require('../models/Image');
const upload = require('../middleware/imageUpload');
const { RESIZE_VALUE } = require('../utils/dummyData');

const imageRouter = Router();
const fileUnlink = promisify(fs.unlink);

imageRouter.post('/', upload.array("image"), async (req, res) => {
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

        RESIZE_VALUE.map(async ({ name, width }) => {
          try {
            const keyOnly = file.path.split(path.sep)[2];
            const newKey = `${name}/${keyOnly}`;
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
    const result = {};
    images.forEach(image => result[image.id] = image);
    res.json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});
imageRouter.get("/", async (req, res) => {
  try {
    const { lastid, ispublic } = req.query;
    if (lastid && !mongoose.isValidObjectId(lastid))
      throw new Error("invalid lastid");
    const images = await Image.find(
      lastid ?
        {
          public: ispublic,
          _id: { $gt: lastid }
        } :
        { public: ispublic }
    ).limit(8);
    const result = {};
    images.forEach(image => result[image.id] = image);
    res.json(result);
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
    const result = {}
    result[image._id] = image;
    res.json(result);
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
    await Promise.all(
      [
        `./uploads/raw/${image.key}`,
        `./uploads/w140/${image.key}`,
        `./uploads/w600/${image.key}`
      ].map(async path => await fileUnlink(path))
    )
    const result = {}
    result[image._id] = image;
    res.json({ message: "요청하신 이미지가 삭제되었습니다.", result });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});
imageRouter.put("/:prevImageId", upload.single('image'), async (req, res) => {
  try {
    if (!req.user)
      throw new Error("권한이 없습니다.");
    const { prevImageId } = req.params;
    let prevImage = await Image.findOneAndUpdate(
      { _id: prevImageId },
      {
        $set: {
          'public': req.body.public,
          'key': req.file.filename,
          'originalFileName': req.file.originalname
        }
      }
    );
    let keyOnly = ""
    RESIZE_VALUE.map(async ({ name, width }) => {
      keyOnly = req.file.path.split(path.sep)[2];
      const newKey = `${name}/${keyOnly}`;
      await sharp(req.file.path)
        .rotate()
        .resize({ width, height: width, fit: "outside" })
        .toFile(`./uploads/${newKey}`);
    });

    [
      `./uploads/raw/${prevImage.key}`,
      `./uploads/w140/${prevImage.key}`,
      `./uploads/w600/${prevImage.key}`
    ].map(path => fs.unlinkSync(path));
    prevImage.key = keyOnly;
    prevImage.originalFileName = req.file.originalname;

    const result = {}
    result[prevImage._id] = prevImage;
    res.json(result);
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
    const result = {}
    result[image._id] = image;
    res.json(result);
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
    const result = {}
    result[image._id] = image;
    res.json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }

});

module.exports = { imageRouter };
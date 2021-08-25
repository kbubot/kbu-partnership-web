require('dotenv').config();
const express = require("express");
const mongoose = require('mongoose');
const { imageRouter } = require("./routes/imageRouter");
const { userRouter } = require("./routes/userRouter");
const { partnerRouter } = require("./routes/partnerRouter");
const { authenticate } = require("./middleware/authentication");

const app = express();
const { MONGO_URL, PORT } = process.env;

mongoose
  .connect(MONGO_URL, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(_ => {
    console.log("MongoDB Connected.")
    app.use("/uploads", express.static("uploads"));
    app.use(express.json());
    app.use(authenticate);
    app.use("/images", imageRouter);
    app.use("/users", userRouter);
    app.use("/partner", partnerRouter);
    app.listen(PORT, () => console.log('Express server listening on PORT ' + PORT));
  })
  .catch(err => console.log(err));
;
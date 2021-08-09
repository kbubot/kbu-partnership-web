const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  hashedPassword: { type: String, required: true },
  sessions: [
    // _id를 세션 id로 사용한다.
    {
      createdAt: { type: Date, required: true },
    }]
}, { timestamps: true })

module.exports = mongoose.model("user", UserSchema);
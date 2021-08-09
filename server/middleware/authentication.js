const mongoose = require("mongoose");
const User = require("../models/User");

const authenticate = async (req, res, next) => {
  /**
   * TODO: 로그아웃 API를 사용하지 않았을시 만료된 세션은 제거해주는 로직
   */
  const { sessionid } = req.headers;
  if (!sessionid || !mongoose.isValidObjectId(sessionid))
    return next();
  const user = await User.findOne({ "sessions._id": sessionid });
  if (!user)
    return next();
  req.user = user;
  return next();
}

module.exports = { authenticate };
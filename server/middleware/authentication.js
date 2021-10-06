const mongoose = require("mongoose");
const User = require("../models/User");

const authenticate = async (req, res, next) => {
  const { sessionid } = req.headers;
  if (!sessionid || !mongoose.isValidObjectId(sessionid))
    return next();

  const beforeFilter = await User.findOne({ "sessions._id": sessionid });
  const expired_sessions = beforeFilter.sessions.map(session => {
    if (Date.now() - new Date(session.createdAt).getTime() > 600000)
      return mongoose.Types.ObjectId(session._id);
  });
  const user = await User.findOneAndUpdate(
    { _id: beforeFilter.id },
    {
      $pull: { sessions: { _id: { $in: expired_sessions } } }
    }
  );
  if (!user)
    return next();
  req.user = user;
  return next();
}

module.exports = { authenticate };
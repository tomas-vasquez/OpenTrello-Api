const mongoose = require("mongoose");
const cache = require("../helpers/cache");

const userSchema = new mongoose.Schema({
  local: {
    email: String,
    password: String,
  },
  user_name: String,
  parent_id: String,
  user_id: String,
  name: String,
  pic_url: String,
  flag: String,
  whatsapp_code_area: String,
  whatsapp_number: String,
  link_facebook: String,
  link_instagram: String,
  link_twitter: String,
  description: String,
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

const model = mongoose.model("User", userSchema);

const { profileCacheTimeout } = require("../config");

const buildQuery = (key, typeKey) => {
  return typeKey === "email"
    ? { "local.email": key }
    : typeKey === "user_name"
    ? { user_name: key }
    : null;
};

const getProfile = function (key, typeKey, callback) {
  let inCache = null;

  if (typeKey === "email") {
    inCache = cache.get(key);
  }

  if (typeKey === "user_name") {
    const email = cache.get(key);
    inCache = cache.get(email);
  }

  if (inCache) {
    callback(null, { ...inCache, fromCache: true });
  } else {
    if (typeKey === "email" || typeKey === "user_name") {
      model.findOne(buildQuery(key, typeKey), function (error, user) {
        callback(error, user ? { ...user._doc } : null);
      });
    }
    if (typeKey === "id") {
      model.findById(key, function (error, user) {
        callback(error, user);
      });
    }
  }
};

const updateProfile = function (key, typeKey, newData, callback) {
  getProfile(key, typeKey, (error, profile) => {
    if (error) callback(error);

    model.updateOne(buildQuery(key, typeKey), newData, function (error) {
      //links to cache
      cache.delete(profile.user_name);
      cache.put(profile.user_name, profile.email, profileCacheTimeout);

      cache.delete(profile.local.email);
      cache.put(profile.local.email, { ...profile }, profileCacheTimeout);

      callback(error, { ...profile, ...newData }, profile.user_name);
    });
  });
};

module.exports = {
  model,
  getProfile,
  updateProfile,
};

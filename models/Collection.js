var mongoose = require('mongoose');
var slugin = require('slugin');

var itemAssetSchema = new mongoose.Schema({
  url: {type:String, required: true},
  thumb: String,
  user: {type: mongoose.Schema.ObjectId, ref: 'User', required: true}
})

var itemSchema = new mongoose.Schema({
  name: {type: String, required: true},
  images: [itemAssetSchema],
  sounds: [itemAssetSchema],
  user: {type: mongoose.Schema.ObjectId, ref: 'User', required: true}
})

var collectionSchema = new mongoose.Schema({
  name: {type: String, required: true},
  description: String,
  items: [itemSchema],
  user: {type: mongoose.Schema.ObjectId, ref: 'User', required: true}
});

collectionSchema.plugin(slugin, {source: 'name'});
module.exports = mongoose.model('Collection', collectionSchema);

var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var PostSchema = new Schema({
  title: { type: String, required: true },
  body: { type: String, required: true },
  author: {  type: Schema.Types.ObjectId, ref: 'User' },
  posted: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Post', PostSchema);
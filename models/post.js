//its just a blog,
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PostSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "Admin" , required: true},
  text: {type: String, required: true}, 
  image: {type: String}
});
module.exports = mongoose.model('Post', PostSchema)

var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;
  
var TagSchema = new Schema({
  name: { type: String },
  view_count: { type: Number, default: Math.ceil(Math.random()*200)},
  create_at: { type: Date, default: Date.now },
  update_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Tui', TagSchema);
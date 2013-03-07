
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;
  
var TopicSchema = new Schema({
  type: { type: Number, default: 0},
  title: { type: String },
  desc: { type: String },
  keywords: { type: String },
  content: { type: String },
  author_id: { type: ObjectId },
  cate_id: { type: ObjectId },
  top: { type: Number, default: 0 },
  like_count: { type:Number, default: Math.ceil(30*Math.random()) },
  view_count: { type: Number, default: Math.ceil(30*Math.random()) },
  reply_count: { type: Number, default: 0 },
  collect_count: { type: Number, default: 0 },
  create_at: { type: Date, default: Date.now },
  update_at: { type: Date, default: Date.now },
  last_reply: { type: ObjectId },
  last_reply_at: { type: Date, default: Date.now },

  from: { type: String, default: 'tao123'},
  pic: { type: String },
  thumb: { type: String },
  video: { type: String },
  source_id: { type: String },
  height: {type: Number}
});


var Jscex = require("jscex"); // 核心组件
require("jscex-jit").init();
require("jscex-async").init(); // 异步模块
require("jscex-async-powerpack").init(); // 异步增强模块

var Binding = Jscex.Async.Binding,
    Task = Jscex.Async.Task;

var Topic = mongoose.model('Topic', TopicSchema);
Topic.findAsync = Binding.fromStandard(Topic.find);
Topic.findOneAsync = Binding.fromStandard(Topic.findOne);
Topic.countAsync = Binding.fromStandard(Topic.count);


Topic.findRandom = eval(Jscex.compile("async", function(num, area){

  //查找范围
  var area = area || num + 200;

  var topics = $await(Topic.findAsync({
    thumb : { $exists:true }
  }, [], {
    sort : [['update_at', -1]],
    limit: area
  }));

  var rets = [], len = topics.length;
  for(var i = 0; i < num; i++){
    rets.push(topics[Math.floor(Math.random()*len)]);
  }

  return rets;
}));


Topic.findNewest = eval(Jscex.compile("async", function(skip, limit){
  var topics = $await(Topic.findAsync({
    thumb : { $exists:true }
  }, [], {
    sort : [['update_at', -1]],
    skip: skip,
    limit: limit
  }));
  return topics;
}));

Topic.findHotest = eval(Jscex.compile("async", function(day, skip, limit){

  var time_duration = Date.now() - 86400000 * (day+0.5);

  var topics = $await(Topic.findAsync({
    create_at : { $gt : new Date(time_duration)},
    thumb : { $exists:true }
  }, [], {
    sort : [
      ['like_count', -1],
      ['view_count', -1]
    ],
    skip: skip,
    limit: limit
  }));

  return topics;
}));


Topic.countHotest = eval(Jscex.compile("async", function(day){

  var time_duration = Date.now() - 86400000 * (day+0.5);

  var num = $await(Topic.countAsync({
    create_at : { $gt : new Date(time_duration)},
    thumb : { $exists:true }
  }));
  return num;
}));

module.exports = Topic;
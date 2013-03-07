

var Jscex = require("jscex"); // 核心组件
require("jscex-jit").init();
require("jscex-async").init(); // 异步模块
require("jscex-async-powerpack").init(); // 异步增强模块

var cache = require('memory-cache'),
    _ = require('underscore');

var Binding = Jscex.Async.Binding,
    Task = Jscex.Async.Task;


Topic.findAsync = Binding.fromStandard(Topic.find);
Topic.findOneAsync = Binding.fromStandard(Topic.findOne);

var getListAsync = eval(Jscex.compile("async", function(topic_id, res){
  var topic = $await(Topic.findOneAsync({ _id: topic_id}));
  res.render('site/show', {
    topic: topic
  });
}));

exports.show = function(req, res, next){
  var topic_id = req.params.id;
  getListAsync(topic_id, res).start();
}

exports.digg = function(req, res, next){

  var topic_id = req.params.id,
      user_ip  = req.connection.remoteAddress;


  var ids = cache.get(user_ip);

  if(!ids || 0 === ids.length){
    ids = topic_id;
    cache.put(user_ip, ids, 864000000);
  }else{
    if(ids.indexOf(topic_id) != -1){
      res.json({
        errMsg: "已顶过"
      });
      return;
    }else{
      ids += ','+topic_id;
      cache.put(user_ip, ids, 864000000);
    }
  }
  
  Topic.update({
    _id: req.params.id
  }, {
    $inc: { like_count: 1}
  }, function(err, d){
    if(err){
      res.json({
        errMsg: err.toString()
      });
    }else{
      res.json({
        'msg': ''
      });
    }
  })
}
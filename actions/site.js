var Pagination = require('../util/pagination');

var Jscex = require("jscex"); // 核心组件
require("jscex-jit").init();
require("jscex-async").init(); // 异步模块
require("jscex-async-powerpack").init(); // 异步增强模块

var cache = require('memory-cache'),
    _ = require('underscore');

var Binding = Jscex.Async.Binding,
    Task = Jscex.Async.Task;


var getNewest = eval(Jscex.compile("async", function(skip, limit){
  return $await(Task.whenAll({
    topics: Topic.findAsync({
        thumb : { $exists:true }
      }, [], {
      sort : [['update_at', -1]],
      skip : skip,
      limit : 9
    }),
    count: Topic.countAsync({})
  }));
}));

var getTopicAsync = eval(Jscex.compile("async", function(id){
  var condition = id ? { _id: id } : {};

  var isHome = id == undefined;

  var topic = $await(Topic.findOneAsync(condition, [], { sort : [['update_at', -1]] }));

  var id = topic.id,
      up_time = topic.update_at;

  topic.next = $await(Topic.findOneAsync({ update_at : { $lt : up_time }}, [], { sort : [['update_at', -1]]}));
  topic.prev = $await(Topic.findOneAsync({ update_at : { $gt : up_time }}, [], { sort : [['update_at', 1]]}));

  topic.isHome = isHome;
  return topic;
}));


var indexAsync = eval(Jscex.compile("async", function(req, res, next){
  var curPage = req.params.page || 1,
      perpage = 9,
      start = (curPage - 1) * perpage || 0;

  var topic_id = req.params.id,
      user_ip  = req.connection.remoteAddress;


  try{

    var data = $await(Task.whenAll({
      topic: getTopicAsync(topic_id),
      list: getNewest(start, perpage),
    }));

    var goods = cache.get('goods');
    if(!goods){
      goods = $await(Topic.findRandom(15));

      if(goods && goods.length){
        cache.put('goods', goods, 3600000);
        cache.put('longtime_goods', goods);
      }else{
        goods = cache.get('longtime_goods');
      }
    }

    var has_digg_ids = cache.get(user_ip);

    if(has_digg_ids && has_digg_ids.indexOf(topic_id) != -1){
      data.topic.hasdig = true;
    }else{
      data.topic.hasdig = false;
    }

    if(!req.query.jsonp){
      res.render('site/index', {
        topic: data.topic,
        topics: data.list.topics,
        goods: goods,
        title:'',
        tops: data.tops,
        page:"index"
      });
    }else{
      res.write('window.onload=function(){ document.getElementById("huanTitle").innerHTML = '+JSON.stringify("笑话："+data.topic.title)+' }', 'utf8')
      res.end()
    }

  }catch(e){
    res.end('no data');
  }

  Topic.update({
    _id: data.topic._id
  }, {
    $inc: { view_count: 1}
  }, function(err, d){})
}));



exports.index = function(req, res, next){
  indexAsync(req, res, next).start();
}

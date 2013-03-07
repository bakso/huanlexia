var Pagination = require('../util/pagination')

var Jscex = require("jscex"); // 核心组件
require("jscex-jit").init();
require("jscex-async").init(); // 异步模块
require("jscex-async-powerpack").init(); // 异步增强模块

var cache = require('memory-cache'),
    _ = require('underscore');

var Binding = Jscex.Async.Binding,
    Task = Jscex.Async.Task;

var perpage = 30;

exports.index = function(req, res, next){
  res.render('list/index', {
    title: "最新笑话",
    page: "list",
    day: 1,
    ajaxUrl: "/list/ajax"
  });
}

function proceed_data(topics){
  for(var i = 0; topics[i]; i++){
    if(topics[i].from = "tao123"){
      topics[i].thumb = topics[i].pic + '_290x290.jpg';

      if(!topics[i].pic) continue;
      var re = topics[i].pic.match(/(\d+)-(\d+)\./);
      if(re){
        var width = re[1],
            height = re[2];
        if(width > 210 && height < width*2 ){
          topics[i].height = Math.ceil(height / (width / 210));
        }else if(width < 210){
          topics[i].height = height;
        }
      }
    }
  }
  return topics;
}

exports.ajax = function(req, res, next){
  var page = parseInt(req.query.page || 1),
      start = (page -1) * perpage;

  var loop = eval(Jscex.compile("async", function(){
    var topics = $await(Topic.findNewest(start, perpage));
    var count = $await(Topic.countAsync({ thumb : { $exists:true } }));
    var pages = Math.ceil(count/perpage);

    var data = {
      topics: proceed_data(topics),
      pages: pages,
      page: page
    }

    res.json(data);
  }));

  loop().start();
}

exports.hot = function(req, res, next){
  var day = req.params.day || 3;

  if(day == 1){
    var title = "24小时"
  }else{
    var title = day+"天"
  }
  res.render('list/index', {
    title: title+"内最热笑话",
    page: "hot"+day,
    day: day,
    ajaxUrl: "/hot/ajax"
  });
}

exports.hot_ajax = function(req, res, next){
  var day = parseInt(req.query.day || 1),
      page = parseInt(req.query.page || 1),
      start = (page -1) * perpage;

  var loop = eval(Jscex.compile("async", function(){
    var topics = $await(Topic.findHotest(day, start, perpage));
    var count = $await(Topic.countHotest(day));
    var pages = Math.ceil(count/perpage);
    var data = {
      topics: proceed_data(topics),
      pages: pages,
      page: page
    }

    res.json(data);
  }));

  loop().start();
}

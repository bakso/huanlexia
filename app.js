
var express = require('express'),
	app = express.createServer(),
  config = require('./config'),
  fs = require('fs'),
  path = require('path'),
  hostname;

app.configure(function(){
  app.use(express.bodyParser());
  app.use(express.logger());
  app.use(express.cookieParser());
  app.use(express.session({ secret: "keyboard xxx" }));
  app.set('jsonp callback', true);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'html');
  app.register('.html', require('ejs'));
  app.set('view options', {
    open: '<?',
    close: '?>'
  });
});

app.configure('development', function(){
    app.use(express.static(__dirname + '/static'));
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  var oneYear = 31557600000;
  app.use(express.static(__dirname + '/static', { maxAge: oneYear }));
  app.use(express.errorHandler());
});

app.dynamicHelpers({
  __get: function(req){
    return req.query
  },
  __params: function(req){
  	return req.params
  },
  __post: function(req){
    return req.body
  },
  __cookie: function(req){
    return req.cookies
  },
  __session: function(req){
    return req.session;
  },
  __siteurl: function(req){
    return 'http://'+req.headers.host+'/'
  }
});

app.helpers({
  _: require('underscore')
});

//自动加载一些全局变量
['path', 'fs', 'mongoose'].forEach(function(m){
  global[m] = require(m);
});

autoload_to_global(__dirname + '/models');

mongoose.connect(config.db, function (err) {
  if (err) {
    console.error('connect to %s error: ', config.db, err.message);
    process.exit(1);
  }
});



app.listen(80);


/**
 * 自动加载到全局
 * @param {String} dirname
 */
function autoload_to_global(dirname){
  console.log('autoload dir: '+dirname);
  var filenames = fs.readdirSync(dirname);
  filenames.forEach(function(file){
    var fn = path.basename(file, '.js'),
        cap_fn = fn.charAt(0).toUpperCase() + fn.substring(1);
    //让首字母大写
    global[cap_fn] = require(path.join(dirname,fn));
    console.log('module '+fn+' loaded!');
  });
}



app.get('*', function(req, res, next){
  hostname = req.header('host');
  next();
});

require('./router')(app);

var http = require('http');

function crontab(){
  http.get('http://'+hostname+'/v587/tao123?auto=1', function(res){
    var resdata = ''
    res.on('data', function(trunk){
      resdata += trunk
    })
    res.on('end', function(){
      console.log(new Date, '自动采集tao123…');
      console.log(resdata);
    });
  });
}

//自动采集任务
setInterval(crontab, 1800000)



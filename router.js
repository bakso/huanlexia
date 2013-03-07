
var site = require('./actions/site'),
	list = require('./actions/list')
	topic = require('./actions/topic'),
	v587 = require('./actions/v587');

module.exports = function(app){
  app.get('/', site.index);

  app.get('/list/page/:page', list.index);
  app.get('/list', list.index);
  app.get('/list/', list.index);
  app.get('/list/ajax', list.ajax);

  app.get('/hot/ajax', list.hot_ajax);
  app.get('/hot/:day', list.hot);
  app.get('/hot', list.hot);


  app.get('/topic/:id.html', site.index);
  app.get('/topic/:id', site.index);

  app.get('/topic/digg/:id', topic.digg);

  app.get('/v587/tao123', v587.tao123);

  app.get('/v587/delete', v587.delete);
  app.post('/v587/save_delete', v587.save_delete);
}
var http = require('http'),
  path = require('path');

function getContent(id, end, time) {

  if (!time) time = Date.now();
  var content = '',
    entrance = 'http://api.tao123.com/shenghuo/xiaohua/?callback=jsonp1341850277309&methods=GetXiaohua&id=';

  http.get(entrance + id, function (res) {
    res.on('data', function (trunk) {
      content += trunk;
    }).on('end', function () {
      
      var re = content.match(/"data":({[\s\S]+})}}\)/);

      if(re && re[1]){
      var d = JSON.parse(re[1].replace(/\t|\r|\n/g, ''));

      //过滤链接
      d.content = d.content.replace(/<a [\s\S]+?\/a>/g, '')
      d.content = d.content.replace(/淘网址/g, '欢乐虾');
      d.title = d.title.replace(/淘网址/g, '欢乐虾');

      //不采集文字笑话
      //if (d.content.indexOf('img') != -1 || d.content.indexOf('embed') != -1) {
      if (d.content.indexOf('img') != -1) {
        var topic = new Topic();
        topic.title = d.title;
        topic.content = d.content;
        topic.view_count = d.view_count;
        topic.like_count = d.like_count;
        topic.form = 'tao123';
        topic.source_id = id;

        topic.create_at = time;
        topic.update_at = time;

        //保存到数据库后的id
        var _save_id;

        if (topic.content.indexOf('embed') != -1) {
          topic.type = 1;

          if (topic.content.indexOf('tudou.com') != -1) {
            var r = topic.content.match(/tudou\.com\/v\/(.+?)\//);
            var tid = r[1];

            //远程获取视频封面
            http.get('http://api.tudou.com/v3/gw?method=item.info.get&appKey=myKey&format=json&itemCodes=' + tid, function (res) {
              var data = '';

              res.on('data', function (trunk) {
                data += trunk
              })

              res.on('end', function () {
                //获取后异步更新数据
                Topic.findOne({
                  _id: _save_id
                }, function (e, t) {
                  try {
                    data = JSON.parse(data);
                    t.thumb = data.multiResult.results[0].bigPicUrl;
                    t.save(function (e, d) {
                      console.log('thumb for tudou:', d);
                      delete(_save_id);
                    });
                  } catch (e) {}
                })
              })

            })
          }

          if (topic.content.indexOf('youku.com') != -1) {
            var r = topic.content.match(/<embed.+?>/);
          }
        }

        if (topic.content.indexOf('img') != -1) {
          var r = topic.content.match(/<img.+?>/);
          if (r) {
            topic.pic = r[0].match(/src=\"(.+?)\"/)[1];
            topic.thumb = topic.pic + '_160x160.jpg';

            console.log('thumb(tao123):', topic.thumb);
          }
        }



        topic.save(function (err, t) {
          if (!err) {
            console.log(t, 'content success');

            _save_id = t._id;

            var tags = d.tags.split(',');
            for (var i = 0; i < tags.length; i++) {
              if (tags[i].replace(/\s/g, '') == '') continue;
              (function (_tag) {
                Tag.findOne({
                  name: _tag
                }, function (err, tag) {
                  if (tag && tag._id) {
                    var topic_tag = new Topictag();
                    topic_tag.topic_id = t._id;
                    topic_tag.tag_id = tag._id;
                    topic_tag.save(function (err, s) {
                      console.log('topicId tagId pushed(old):', _tag, s);
                    });
                  } else {
                    var tag = new Tag();
                    tag.name = _tag;
                    tag.save(function (e, s) {
                      console.log('tag added(new):', s);
                      var topic_tag = new Topictag();
                      topic_tag.topic_id = t._id;
                      topic_tag.tag_id = s._id;
                      topic_tag.save(function (err, s) {
                        console.log('topicId tagId pushed(new):', _tag, s);
                      });
                    });
                  }
                })
              })(tags[i])
            }
          }
        })
      }


      if (d.pre && d.pre <= end) {
        setTimeout(function () {
          getContent(d.pre, end);
        }, 50);
      }

      }else{
        var next = parseInt(id)+1;
        if (next <= end) getContent(next, end);
      }
    });
  });
}

exports.tao123 = function (req, res, next) {
  var start = req.query.start,
    end = req.query.end;


  if (start && end) {
    getContent(start, end);
    res.end('in process..');
  } else if(req.query.auto){
    Topic.findOne({
      "from": "tao123"
    }, [], {
      sort: [
        ['update_at', - 1]
      ]
    }, function (err, data) {
      var start = parseInt(data.source_id) + 1,
          end = start + 30;
      getContent(start, end);
      res.end('auto in process..beign:'+start+', end'+end);
    });
  } else {
    Topic.findOne({
      "from": "tao123"
    }, [], {
      sort: [
        ['update_at', - 1]
      ]
    }, function (err, data) {
      if (err) res.end(err.toString())
      else if (data) res.end(data.toString())
      else res.end('empty')
    })
  }
}


exports.delete = function (req, res) {
  res.render('v587/man', {
    title: 'xxx',
    page: "aaa"
  });
}

exports.save_delete = function (req, res) {
  var ids = req.body.ids.split(/\r?\n/),
      len = ids.length, count = 0;

  res.write(ids.toString());
  res.write(',')

  for (var i = 0; i < ids.length; i++) {
    (function(id, i){

      Topic.remove({
        _id: id
      }, function(err){
        if(err) res.end('delete error:'+id+JSON.stringify(err));
        if(++count == len){
          res.write(id);
          res.end('');
        }else{
          res.write(id);
          res.write(",")
        }
      })
    })(ids[i], i);

  }

}
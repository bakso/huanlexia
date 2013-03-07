seajs.config({
  alias: {
    'jquery': '/jquery.js'
  }
});


define(function(require){
  $ = require('jquery'),
  Nav = require('./navigation'),
  Digg = require('./digg'),

  diggBtn = $('#J_DiggBtn');

  $(document).ready(function(){
    diggBtn.hover(function(){
      var hoverCls = diggBtn.hasClass('hasdig') ? 'hasdig-hover' : 'nodig-hover';
      diggBtn.addClass(hoverCls);
    }, function(){
      diggBtn.removeClass('hasdig-hover');
      diggBtn.removeClass('nodig-hover');
    });

    diggBtn.click(function(){
      if(diggBtn.hasClass('hasdig')) return;
      
      Digg.plus(diggBtn.attr('data-id'), function(data){
        if(data.errMsg){
          alert(data.errMsg)
        }else{
          var numEl = diggBtn.find('.num'),
              statusEl = diggBtn.find('.status'),
              numAnim = diggBtn.find('.num-animation'),
              num = numEl.html();
          num = num ? parseInt(num) : 0;

          numAnim.show().animate({
            top: -10,
            opacity: 0
          }, 500, function(){
            numEl.html(num+1);
            statusEl.html('笑过')
            diggBtn.removeClass('nodig');
            diggBtn.removeClass('nodig-hover');
            diggBtn.addClass('hasdig')
          })          
        }
	    });
    });

    var preLink = $('.arr-pre').attr('href'),
        nextLink = $('.arr-next').attr('href');

    $(document).bind('keyup',function(ev){

      if(ev.keyCode == 37){
        if(preLink) location = preLink;
      }

      if(ev.keyCode == 39){
        if(nextLink) location = nextLink;
      }
    });

    var contentNode = $('#J_Content');

    contentNode.bind('mousemove', function(ev){
      var posx = ev.pageX - contentNode.offset().left,
          widthd2 = contentNode.width()/2;
      if(posx < widthd2){
        contentNode.removeClass('nextCur');
        if(preLink) contentNode.addClass('prevCur');
      }else{
        contentNode.removeClass('prevCur')
        if(nextLink) contentNode.addClass('nextCur');
      }
    }).bind('click', function(){
      if(contentNode.hasClass('prevCur')) location = preLink;
      if(contentNode.hasClass('nextCur')) location = nextLink;
    }).trigger('mousemove');

  })
});
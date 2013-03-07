define(function(require, exports){
  
  $ = require('jquery');

  exports.plus = function(id, callback){

    $.ajax({
      type: 'GET',
      url: '/topic/digg/'+id,
      success: callback,
      dataType: "json"
    });
  }
});

/**
 * constructor
 * @param {int} total
 * @param {int} per
 * @param {string} url format:"/page/{IDX}" or "?page={IDX}"
 */
var Pagination = function(total, per, url){
  this.totalNum = total;
  this.perpage = per;
  this.url = url;
  this.linkstr = '<a href="'+url+'">{IDX}</a>';
  this.finalPage = Math.ceil(total / per);
  this.startBreakPage = 6;
}

/**
 * Build pagination html string
 * @param  {int} currentPage
 * @return {string}
 */
Pagination.prototype.build = function(currentPage){

  console.log(this.totalNum, this.perpage, currentPage);

  var html = '<div class="ui-page"><div class="ui-page-wrap"><b class="ui-page-num">',
  	  finalPage = this.finalPage,
  	  currentPage = parseInt(currentPage),
      prev = currentPage > 1 ? currentPage - 1 : 0,
      next = currentPage < finalPage ? currentPage + 1 : finalPage,
      startBreakPage = this.startBreakPage,
      endBreakPage = finalPage - 3;

  if(1 == currentPage && finalPage != 1){
    html += '<b class="ui-page-prev">&lt;&lt; 上一页</b>';
    html += '<b class="ui-page-cur">1</b>';
    if(finalPage > startBreakPage){
      html += this._buildLink(2);
      html += this._buildLink(3);
      html += this._buildLink(4);
      html += this._buildLink(5);
      html += '<b class="ui-page-break">...</b>';
      html += this._buildLink(finalPage);
    }else{
      for(var i = 2; i <= finalPage; i++){
        html += this._buildLink(i)
      }
    }
    html += '<a class="ui-page-next" href="'+this._buildUrl(next)+'">下一页 &gt;&gt;</a>';
  }

  if(1 < currentPage && currentPage <= startBreakPage){
    html += '<a class="ui-page-prev" href="'+this._buildUrl(prev)+'">&lt;&lt; 上一页</b>';

    for (var i = 1; i < currentPage; i++){
        html += this._buildLink(i);
    }

    html += '<b class="ui-page-cur">'+currentPage+'</b>';

    if(finalPage-currentPage > 5){
      html += this._buildLink(i+1);
      html += this._buildLink(i+2);
      html += '<b class="ui-page-break">...</b>';
      html += this._buildLink(finalPage);
    }else{
      for(var i = next; i <= finalPage; i++)
        html += this._buildLink(i);      
    }
    html += '<a class="ui-page-next" href="'+this._buildUrl(next)+'">下一页 &gt;&gt;</a>';
  }

  if(startBreakPage < currentPage && currentPage < endBreakPage){
  	html += '<a class="ui-page-prev" href="'+this._buildUrl(prev)+'">&lt;&lt; 上一页</b>';
  	html += this._buildLink(1);
    html += '<b class="ui-page-break">...</b>';
    html += this._buildLink(currentPage - 2);
    html += this._buildLink(currentPage - 1);
    html += '<b class="ui-page-cur">'+currentPage+'</b>';
    html += this._buildLink(currentPage + 1);
    html += this._buildLink(currentPage + 2);
    html += '<b class="ui-page-break">...</b>';
    html += this._buildLink(finalPage);
  	html += '<a class="ui-page-next" href="'+this._buildUrl(next)+'">下一页 &gt;&gt;</a>';
  }

  if(currentPage > startBreakPage && endBreakPage <= currentPage && currentPage < finalPage){
    html += '<a class="ui-page-prev" href="'+this._buildUrl(prev)+'">&lt;&lt; 上一页</b>';
    html += this._buildLink(1);
    html += '<b class="ui-page-break">...</b>';
    html += this._buildLink(prev-2);
    html += this._buildLink(prev-1);
    html += '<b class="ui-page-cur">'+currentPage+'</b>';
    for(var i = currentPage+1; i <= finalPage; i++){
      html += this._buildLink(i);
    }
  	html += '<a class="ui-page-next" href="'+this._buildUrl(next)+'">下一页 &gt;&gt;</a>';
  }

  if(finalPage == currentPage && finalPage >=5){
    html += '<a class="ui-page-prev" href="'+this._buildUrl(prev)+'">&lt;&lt; 上一页</b>';
    html += this._buildLink(1);
    html += '<b class="ui-page-break">...</b>';
    html += this._buildLink(finalPage-2);
    html += this._buildLink(finalPage-1);
    html += '<b class="ui-page-cur">'+finalPage+'</b>';
    html += '<b class="ui-page-next">下一页 &gt;&gt;</b>';
  }

  return html + '</b></div></div>';
}

Pagination.prototype._buildLink = function(page){
  return this.linkstr.replace(/{IDX}/g, page);
}

Pagination.prototype._buildUrl = function(page){
  return this.url.replace(/{IDX}/g, page);
}

module.exports = Pagination;

/*

use:
  var total = 500, perpage = 10;
  var pager = new Pagination(total, perpage, '/list/page/{IDX}');
  pager.build(3);

gernate:
<div class="ui-page">
    <div class="ui-page-wrap">
        <b class="ui-page-num">
            <a class="ui-page-prev" href="/list/page/2">&lt;&lt; 上一页</a>
            <a href="/list/page/1">1</a>
            <a href="/list/page/2">2</a>
            <b class="ui-page-cur">3</b>
            <a href="/list/page/4">4</a>
            <a href="/list/page/5">5</a>
            <b class="ui-page-break">...</b>
            <a href="/list/page/50">50</a>
            <a class="ui-page-next" href="/list/page/4">下一页 &gt;&gt;</a>
        </b>
    </div>
</div>
*/
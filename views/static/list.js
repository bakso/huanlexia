KISSY.use("waterfall,ajax,template,node,button", function (S, Waterfall, io, Template, Node, Button) {
  var $ = Node.all;

  var tpl = Template($('#tpl').html()),
    nextpage = 1,
    waterfall = new Waterfall.Loader({
      container: "#J_GoodsWall",
      effect: { effect:"fadeIn", duration:0.3 },
      load: function (success, end) {
        $('#loadingPins').show();
        S.ajax({
          data: {
            'page': nextpage,
            'per_page': 30,
            'format': 'json',
            'day': <?=day?>
          },
          url: "<?=ajaxUrl?>",
          dataType: "jsonp",
          success: function (d) {

            // 如果到最后一页了, 也结束加载
            nextpage = d.page + 1;
            if (nextpage > d.pages) {
              end();
              return;
            }
            // 拼装每页数据
            var items = [];
            S.each(d.topics, function (item) {
              if (!item.height) {
                //item.height = Math.round(Math.random() * (300 - 180) + 180); // fake height
                item.height = 300; // fake height
              }
              items.push(new S.Node(tpl.render(item)));
            });

            success(items);
          },
          complete: function () {
            $('#loadingPins').hide();
          }
        });
      },
      minColCount: 2,
      colWidth: 245
    });
});
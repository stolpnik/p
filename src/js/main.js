(function() {
  var _init;

  require(['jquery', 'showdown', 'hogan.min'], function($, showdown, hogan) {
    return require(['templates.hogan', 'p'], function(t, p) {
      var P;
      P = p.P;
      return $(function() {
        var pr;
        pr = new P("body", p.S);
        return $.when(pr.init("p.md")).done(_init);
      });
    });
  });

  _init = function(d) {
    return console.log("start!!!");
  };

}).call(this);

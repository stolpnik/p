(function() {
  var _init;

  require(['jquery', 'showdown', 'hogan.min'], function() {
    return require(['templates.hogan', 'p', 's', 'r'], function() {
      var P, p, pr;
      p = this.p;
      P = p.P;
      pr = null;
      return $(function() {
        pr = new P("body", p.S);
        return $.when(pr.init("p.md")).done(_init);
      });
    });
  });

  _init = function(d) {
    return console.log("start!!!");
  };

}).call(this);

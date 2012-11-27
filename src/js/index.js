(function() {
  var P, p, pr, _init;

  p = this.p;

  P = p.P;

  pr = null;

  _init = function(d) {
    return console.log("start!!!");
  };

  $(function() {
    pr = new P("body", p.S);
    return $.when(pr.init("p.md")).done(_init);
  });

}).call(this);

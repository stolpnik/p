var P, p, pr, _init;

p = this.p;

P = p.P;

pr = null;

_init = function(d) {
  return $("h1").click(function() {
    if (document.body.webkitRequestFullScreen != null) {
      return document.body.webkitRequestFullScreen();
    }
  });
};

$(function() {
  pr = new P("body", p.S);
  return $.when(pr.init("p.md")).done(_init);
});

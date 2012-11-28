(function() {
  var P, R, S;

  P = null;

  R = null;

  S = null;

  require(['../../components/jquery/jquery', '../../app/js/showdown', '../../app/js/hogan.min'], function($, showdown, hogan) {
    return require(['../../app/js/templates.hogan'], function() {
      require(["p.test"], function() {
        return require(["../runner/runner"]);
      });
    });
  });

}).call(this);

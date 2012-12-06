(function() {
  var P, R, S;

  P = null;

  S = null;

  R = null;

  define(["p"], function(p) {
    P = p.P;
    S = p.S;
    return R = p.R;
  });

  describe("p", function() {
    var presen;
    presen = null;
    before(function() {
      return location.hash = "";
    });
    beforeEach(function() {
      $(document).off("keyup");
      $(document).off("keydown");
      presen = new P();
      return $("#p").remove();
    });
    describe("load", function() {
      return it("load p.md file", function(done) {
        var dfd;
        dfd = presen.load();
        return $.when(dfd).done(function(d) {
          d.should.be.a("string");
          return done();
        });
      });
    });
    describe("parse", function() {
      return it("parse p.md file with showdown", function(done) {
        var dfd;
        dfd = presen.load();
        return $.when(dfd).done(function(d) {
          var html;
          html = presen.parse(d);
          html.should.be.a("string");
          return done();
        });
      });
    });
    describe("addPages", function() {
      return it("split compiled markdown string to pages", function(done) {
        var dfd;
        dfd = presen.load();
        return $.when(dfd).done(function(d) {
          var html;
          html = presen.parse(d);
          presen.addPages(html);
          presen.title.should.match(/<h1.+>.+<\/h1>/);
          presen.pages.should.be.a("array")["with"].length(4);
          return done();
        });
      });
    });
    describe("setup", function(done) {
      return it("render a title", function(done) {
        var dfd;
        dfd = presen.load();
        return $.when(dfd).done(function(d) {
          var html;
          html = presen.parse(d);
          presen.addPages(html);
          presen.setup();
          $("div#p").should.be.length(1);
          $("h1", $("div#p")).should.be.length(1);
          $("h1", $("div#p"));
          return done();
        });
      });
    });
    describe("render S", function(done) {
      return it("show 1st page(default)", function(done) {
        var dfd;
        presen = new P("body", S);
        dfd = presen.load();
        return $.when(dfd).done(function(d) {
          var html;
          html = presen.parse(d);
          presen.addPages(html);
          location.hash = "";
          presen.setup();
          $("#page-1").css("display").should.be.equal("block");
          return done();
        });
      });
    });
    describe("render a page no", function() {
      it("shows page 1/4", function(done) {
        var dfd;
        dfd = presen.load();
        return $.when(dfd).done(function(d) {
          var html;
          html = presen.parse(d);
          presen.addPages(html);
          location.hash = "";
          presen.setup();
          $("#current-page").text().should.be.equal('1');
          $("#total-pages").text().should.be.equal('4');
          return done();
        });
      });
      return it("shows page 3/4", function(done) {
        var dfd;
        dfd = presen.load();
        return $.when(dfd).done(function(d) {
          var html;
          html = presen.parse(d);
          presen.addPages(html);
          presen.setup();
          presen.show(3);
          $("#current-page").text().should.be.equal('3');
          $("#total-pages").text().should.be.equal('4');
          return done();
        });
      });
    });
    describe("next", function() {
      return describe("render with S", function() {
        beforeEach(function() {
          $(document).off("keyup");
          $(document).off("keydown");
          $("#p").remove();
          return presen = new P("body", S);
        });
        return it("render a next page", function(done) {
          var dfd;
          dfd = presen.load();
          return $.when(dfd).done(function(d) {
            var html;
            html = presen.parse(d);
            presen.addPages(html);
            location.hash = "";
            presen.setup();
            presen.next().should.be.match(/bbb/g);
            $("#page-1").css("display").should.be.equal("none");
            $("#page-2").css("display").should.be.equal("block");
            return done();
          });
        });
      });
    });
    return describe("prev", function() {
      return describe("render with S", function() {
        beforeEach(function() {
          $(document).off("keyup");
          $(document).off("keydown");
          $("#p").remove();
          return presen = new P("body", S);
        });
        return it("render a prev page", function(done) {
          var dfd;
          dfd = presen.load();
          return $.when(dfd).done(function(d) {
            var html;
            html = presen.parse(d);
            presen.addPages(html);
            location.hash = "";
            presen.setup();
            presen.prev().should.be.match(/ddd/g);
            $("#page-1").css("display").should.be.equal("none");
            $("#page-4").css("display").should.be.equal("block");
            return done();
          });
        });
      });
    });
  });

  describe("ui", function() {
    var presen;
    presen = null;
    beforeEach(function() {
      $(document).off("keyup");
      $(document).off("keydown");
      presen = new P("body", S);
      return $("#p").remove();
    });
    afterEach(function() {
      return $(document).trigger($.Event("keyup"));
    });
    describe("arrow key right", function() {
      return it("render a next page", function(done) {
        var dfd;
        dfd = presen.load();
        return $.when(dfd).done(function(d) {
          var e, html;
          html = presen.parse(d);
          presen.addPages(html);
          location.hash = "";
          presen.setup();
          e = $.Event("keydown");
          e.keyCode = P.RIGHT;
          $(document).trigger(e);
          $("#page-1").css("display").should.be.equal("none");
          $("#page-2").css("display").should.be.equal("block");
          return done();
        });
      });
    });
    describe("arrow key left", function() {
      return it("render a prev page", function(done) {
        var dfd;
        dfd = presen.load();
        return $.when(dfd).done(function(d) {
          var e, html;
          html = presen.parse(d);
          presen.addPages(html);
          location.hash = "";
          presen.setup();
          e = $.Event("keydown");
          e.keyCode = P.LEFT;
          $(document).trigger(e);
          $("#page-1").css("display").should.be.equal("none");
          $("#page-4").css("display").should.be.equal("block");
          return done();
        });
      });
    });
    describe("arrow key up", function() {
      return it("render a first page", function(done) {
        var dfd;
        dfd = presen.load();
        return $.when(dfd).done(function(d) {
          var e, html;
          html = presen.parse(d);
          presen.addPages(html);
          location.hash = "";
          presen.setup();
          e = $.Event("keydown");
          e.keyCode = P.UP;
          $(document).trigger(e);
          $("#page-1").css("display").should.be.equal("block");
          $("#page-2").css("display").should.be.equal("none");
          return done();
        });
      });
    });
    return describe("arrow key down", function() {
      return it("render a last page", function(done) {
        var dfd;
        dfd = presen.load();
        return $.when(dfd).done(function(d) {
          var e, html;
          html = presen.parse(d);
          presen.addPages(html);
          location.hash = "";
          presen.setup();
          e = $.Event("keydown");
          e.keyCode = P.DOWN;
          $(document).trigger(e);
          $("#page-1").css("display").should.be.equal("none");
          $("#page-4").css("display").should.be.equal("block");
          return done();
        });
      });
    });
  });

  describe("paging", function() {
    var presen;
    presen = null;
    beforeEach(function() {
      $(document).off("keyup");
      $(document).off("keydown");
      presen = new P("body", S);
      return $("#p").remove();
    });
    afterEach(function() {
      return $(document).trigger($.Event("keyup"));
    });
    it("add url current page hash", function(done) {
      var dfd;
      dfd = presen.load();
      return $.when(dfd).done(function(d) {
        var e, html;
        html = presen.parse(d);
        presen.addPages(html);
        location.hash = "";
        presen.setup();
        e = $.Event("keydown");
        e.keyCode = P.RIGHT;
        $(document).trigger(e);
        location.hash.should.be.equal("#2");
        return done();
      });
    });
    return it("two next page and history.back() should show page2", function(done) {
      var dfd;
      dfd = presen.load();
      return $.when(dfd).done(function(d) {
        var e, html;
        html = presen.parse(d);
        presen.addPages(html);
        location.hash = "";
        presen.setup();
        e = $.Event("keydown");
        e.keyCode = P.RIGHT;
        $(document).trigger(e);
        $(document).trigger(e);
        window.history.back();
        $("#page-1").css("display").should.be.equal("none");
        $("#page-2").css("display").should.be.equal("block");
        $("#page-3").css("display").should.be.equal("none");
        $("#page-4").css("display").should.be.equal("none");
        return done();
      });
    });
  });

}).call(this);

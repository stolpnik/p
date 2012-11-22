var P, R, S;

P = this.p.P;

R = this.p.R;

S = this.p.S;

describe("p", function() {
  var presen;
  presen = null;
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
  describe("next", function() {
    describe("render with R", function() {
      return it("render a next page", function(done) {
        var dfd;
        dfd = presen.load();
        return $.when(dfd).done(function(d) {
          var html;
          html = presen.parse(d);
          presen.addPages(html);
          presen.setup();
          presen.next().should.be.match(/bbb/g);
          $("#page-1").hasClass("flipPage").should.be["true"];
          return done();
        });
      });
    });
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
    describe("render with R", function() {
      return it("render a prev page", function(done) {
        var dfd;
        dfd = presen.load();
        return $.when(dfd).done(function(d) {
          var html;
          html = presen.parse(d);
          presen.addPages(html);
          presen.setup();
          presen.prev().should.be.match(/ddd/g);
          $("#page-1").hasClass("flipPage").should.be["true"];
          return setTimeout(function() {
            $("#page-1").css("zIndex").should.be.equal('-4');
            return done();
          }, 1250);
        });
      });
    });
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

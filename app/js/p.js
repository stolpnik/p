(function() {
  var P, R, S,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  S = null;

  R = null;

  P = (function() {
    /*
    	* constatns
    */

    P.SPLIT_STR = "|||||";

    P.LEFT = 37;

    P.UP = 38;

    P.RIGHT = 39;

    P.DOWN = 40;

    P.IDLE = 0;

    P.FIRED = 1;

    /*
    	* properties
    */


    P.prototype.data = null;

    P.prototype.title = null;

    P.prototype.pages = null;

    P.prototype.renderer = null;

    P.prototype.lastPage = 1;

    P.prototype.currentPage = 1;

    P.prototype.totalPages = 0;

    P.prototype.keyState = P.IDLE;

    /*
    	* constructors
    */


    function P(target, renderer) {
      if (target == null) {
        target = 'body';
      }
      if (renderer == null) {
        renderer = S;
      }
      this.pageMove = __bind(this.pageMove, this);

      this.data = "";
      this.title = "";
      this.pages = [];
      this.renderer = new renderer(target);
    }

    /*
    	* init
    	* @param target {String} path to markdown file to load
    */


    P.prototype.init = function(target) {
      var dfd, myself;
      if (target == null) {
        target = "p.md";
      }
      myself = this;
      dfd = $.Deferred();
      $.when(this.load(target)).done(function(d) {
        myself.addPages(myself.parse(d));
        myself.setup();
        return dfd.resolve();
      }).fail(function(e) {
        throw e;
        return dfd.reject();
      });
      return dfd.promise();
    };

    P.prototype.load = function(target) {
      var dfd;
      if (target == null) {
        target = "p.md";
      }
      dfd = $.get(target);
      $.when(dfd).done(function(d) {
        return this.data = d;
      }).fail(function(e) {
        throw e;
      });
      return dfd;
    };

    P.prototype.parse = function(data) {
      var converter;
      converter = new Showdown.converter();
      return converter.makeHtml(data);
    };

    P.prototype.addPages = function(md) {
      var i, pageBodies, pageTitles, pt, title, titleRegExp, _i, _len, _results;
      titleRegExp = /(<h1.+"?>.+<\/h1>)/;
      title = md.match(titleRegExp);
      if (title[0] != null) {
        this.title = title[0];
      }
      md = md.replace(titleRegExp, '');
      pageTitles = md.match(/(<h2.+"?>.+<\/h2>)/g);
      md = md.replace(/(<h2.+"?>.+<\/h2>)/g, P.SPLIT_STR);
      pageBodies = md.split(P.SPLIT_STR);
      pageBodies.shift();
      this.totalPages = pageTitles.length;
      _results = [];
      for (i = _i = 0, _len = pageTitles.length; _i < _len; i = ++_i) {
        pt = pageTitles[i];
        _results.push(this.pages.push("" + pt + "\n" + pageBodies[i]));
      }
      return _results;
    };

    P.prototype.setup = function() {
      var _this = this;
      this.renderer.render(this);
      $(document).keydown(this.pageMove);
      $(document).keyup(function(e) {
        return _this.keyState = P.IDLE;
      });
      return $(window).resize(this.renderer.resize);
    };

    P.prototype.show = function(pageNum) {
      var page;
      if (pageNum == null) {
        pageNum = 1;
      }
      this.lastPage = this.currentPage;
      this.currentPage = pageNum;
      page = this.pages[pageNum - 1];
      this.renderer.showPage(pageNum, this.lastPage);
      return page;
    };

    P.prototype.pageMove = function(e) {
      if (this.keyState === P.FIRED) {
        return;
      }
      switch (e.keyCode) {
        case P.RIGHT:
          this.next();
          return this.keyState = P.FIRED;
        case P.LEFT:
          this.prev();
          return this.keyState = P.FIRED;
        case P.UP:
          this.show(1);
          return this.keyState = P.FIRED;
        case P.DOWN:
          this.show(this.totalPages);
          return this.keyState = P.FIRED;
      }
    };

    P.prototype.next = function() {
      var nextPage;
      nextPage = this.currentPage === this.totalPages ? 1 : this.currentPage + 1;
      return this.show(nextPage);
    };

    P.prototype.prev = function() {
      var prevPage;
      prevPage = this.currentPage === 1 ? this.totalPages : this.currentPage - 1;
      return this.show(prevPage);
    };

    return P;

  })();

  define(["s", "r"], function(s, r) {
    S = s;
    R = r;
    return {
      P: P,
      S: S,
      R: R
    };
  });

}).call(this);

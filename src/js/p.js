(function($){

(function() {
  var P,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  P = (function() {

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

  this.p || (this.p = {});

  this.p.P = P;

}).call(this);

(function() {
  var S;

  S = (function() {

    function S(target) {
      this.target = $(target);
    }

    S.prototype.render = function(p) {
      var i, page;
      this.container = $(templates.page.render({
        title: p.title,
        totalPages: p.totalPages,
        pages: (function() {
          var _i, _len, _ref, _results;
          _ref = p.pages;
          _results = [];
          for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
            page = _ref[i];
            _results.push({
              pageNum: i + 1,
              pageId: "page-" + (i + 1),
              zIndex: p.totalPages - i,
              pageHtml: page
            });
          }
          return _results;
        })()
      }));
      this.target.append(this.container);
      $("div.page", this.container).hide();
      $("div#page-1", this.container).show();
      $("#p").on("webkitAnimationStart", "div.page", function() {});
      $("#p").on("webkitAnimationEnd", "div.page", function() {});
      this.resize();
      return $("h1", this.target).click(function() {
        if (document.body.webkitRequestFullScreen != null) {
          return document.body.webkitRequestFullScreen();
        }
      });
    };

    S.prototype.resize = function(e) {
      var pageHeight, t;
      t = $("div.page", this.container);
      pageHeight = $(window).height();
      return t.css({
        top: (pageHeight - t.height()) * 0.5
      });
    };

    S.prototype.showPage = function(page, lastPage) {
      if (lastPage != null) {
        $("#page-" + lastPage).hide();
      }
      $("#page-" + page).show();
      return $("#current-page").text(page);
    };

    return S;

  })();

  this.p || (this.p = {});

  this.p.S = S;

}).call(this);

})(jQuery);
var P, R, S,
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
      renderer = R;
    }
    this.pageMove = __bind(this.pageMove, this);

    this.data = "";
    this.title = "";
    this.pages = [];
    this.renderer = new renderer(target);
  }

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

R = (function() {

  function R(target) {
    this.target = $(target);
  }

  R.prototype.render = function(p) {
    var i, page;
    this.container = $(templates.page.render({
      title: p.title,
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
    $("#p").on("webkitAnimationStart", "div.page", function() {
      var pageNum, prev, self, zIndex;
      self = $(this);
      zIndex = parseInt(self.data("original-zindex"), 10);
      clearInterval(parseInt(self.data("interval-id"), 10));
      self.data("interval-id", setInterval(function() {
        return null;
      }, 17));
      if (self.hasClass("unflipPage")) {
        return self.css({
          zIndex: zIndex
        });
      } else {
        pageNum = parseInt(self.data("page-num"), 10);
        if (pageNum > 1) {
          prev = $("#page-" + (pageNum - 1));
          return prev.css({
            zIndex: -parseInt(prev.data("original-zindex"), 10)
          });
        }
      }
    });
    $("#p").on("webkitAnimationEnd", "div.page", function() {
      var self, zIndex;
      self = $(this);
      clearInterval(parseInt(self.data("interval-id"), 10));
      zIndex = parseInt(self.data("original-zindex"), 10);
      if (self.hasClass("flipPage")) {
        zIndex *= -1;
        return self.css({
          zIndex: zIndex
        });
      }
    });
    return this.resize();
  };

  R.prototype.resize = function(e) {
    var pageHeight, t;
    t = $("div.page", this.container);
    pageHeight = $(window).height();
    return t.css({
      top: (pageHeight - t.height()) * 0.5
    });
  };

  R.prototype.showPage = function(page, lastPage) {
    var i, _i, _j, _results, _results1;
    if ((lastPage != null) && page !== lastPage) {
      if (page > lastPage) {
        _results = [];
        for (i = _i = lastPage; lastPage <= page ? _i < page : _i > page; i = lastPage <= page ? ++_i : --_i) {
          _results.push($("#page-" + i, this.container).removeClass("unflipPage").addClass("flipPage").css("-webkit-animation-delay", "" + (0.05 * i) + "s"));
        }
        return _results;
      } else if (page < lastPage) {
        _results1 = [];
        for (i = _j = page; page <= lastPage ? _j < lastPage : _j > lastPage; i = page <= lastPage ? ++_j : --_j) {
          _results1.push($("#page-" + i, this.container).removeClass("flipPage").addClass("unflipPage").css("-webkit-animation-delay", "" + (0.05 * i) + "s"));
        }
        return _results1;
      }
    }
  };

  return R;

})();

S = (function() {

  function S(target) {
    this.target = $(target);
  }

  S.prototype.render = function(p) {
    var i, page;
    this.container = $(templates.page.render({
      title: p.title,
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
    $("div.page:nth-child(n+1)", this.container).hide();
    $("#p").on("webkitAnimationStart", "div.page", function() {});
    $("#p").on("webkitAnimationEnd", "div.page", function() {});
    return this.resize();
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
    return $("#page-" + page).show();
  };

  return S;

})();

this.p || (this.p = {});

this.p.P = P;

this.p.S = S;

this.p.R = R;

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

  define(function() {
    return S;
  });

}).call(this);

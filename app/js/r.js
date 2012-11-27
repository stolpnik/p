(function() {
  var R;

  R = (function() {

    function R(target) {
      this.target = $(target);
    }

    R.prototype.render = function(p) {
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
      var i, _i, _j;
      if ((lastPage != null) && page !== lastPage) {
        if (page > lastPage) {
          for (i = _i = lastPage; lastPage <= page ? _i < page : _i > page; i = lastPage <= page ? ++_i : --_i) {
            $("#page-" + i, this.container).removeClass("unflipPage").addClass("flipPage").css("-webkit-animation-delay", "" + (0.05 * i) + "s");
          }
        } else if (page < lastPage) {
          for (i = _j = page; page <= lastPage ? _j < lastPage : _j > lastPage; i = page <= lastPage ? ++_j : --_j) {
            $("#page-" + i, this.container).removeClass("flipPage").addClass("unflipPage").css("-webkit-animation-delay", "" + (0.05 * i) + "s");
          }
        }
      }
      return $("#current-page").text(page);
    };

    return R;

  })();

  this.p || (this.p = {});

  this.p.R = R;

}).call(this);

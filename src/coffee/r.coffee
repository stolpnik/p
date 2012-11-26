class R
	constructor : (target)->
		this.target = $(target)

	render : (p)->
		this.container = $(templates.page.render(
			{
			title : p.title
			totalPages : p.totalPages
			pages : for page, i in p.pages
				pageNum : i + 1
				pageId : "page-#{i + 1}"
				zIndex : p.totalPages - i
				pageHtml : page
			}
		))
		this.target.append( this.container )
		#this.resize()
		$("#p").on( "webkitAnimationStart", "div.page", ->
			self = $(this)
			zIndex = parseInt( self.data("original-zindex"), 10 )
			clearInterval parseInt( self.data("interval-id"), 10 )
			self.data("interval-id", setInterval(
				->
					null
				#console.info( self.data( "page-num" ), self.css("-webkit-transform") )
			,17
			))
			if self.hasClass("unflipPage")
				self.css(
					zIndex : zIndex
				)
			else
				pageNum = parseInt( self.data("page-num"), 10 )
				if pageNum > 1
					prev = $("#page-#{pageNum-1}")
					prev.css(
						zIndex : -parseInt( prev.data("original-zindex"), 10 )
					)
		)
		$("#p").on( "webkitAnimationEnd", "div.page", ->
			self = $(this)
			clearInterval parseInt( self.data("interval-id"), 10 )
			zIndex = parseInt( self.data("original-zindex"), 10 )
			if self.hasClass("flipPage")
				zIndex *= -1
				self.css( zIndex : zIndex )
		)
		this.resize()

	resize : (e)->
		t = $( "div.page", this.container )
		pageHeight = $(window).height()
		t.css(
			top : ( pageHeight - t.height() ) * 0.5
		)

	showPage : (page, lastPage)->
		#console.info "page : #{page} / lastPage : #{lastPage}"

		if lastPage? && page != lastPage
			if page > lastPage
				for i in [lastPage...page]
					$("#page-#{i}", this.container).removeClass( "unflipPage" )
						.addClass( "flipPage" )
						.css( "-webkit-animation-delay", "#{0.05 * i}s" )
			else if page < lastPage
				for i in [page...lastPage]
					$("#page-#{i}", this.container).removeClass( "flipPage" )
						.addClass( "unflipPage" )
						.css( "-webkit-animation-delay", "#{0.05 * i}s" )
		#page no
		$("#current-page").text( page )

@p ||= {}
@p.R = R
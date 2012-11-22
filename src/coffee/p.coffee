class P
	@SPLIT_STR : "|||||"
	@LEFT : 37
	@UP : 38
	@RIGHT : 39
	@DOWN : 40

	@IDLE : 0
	@FIRED : 1

	###
	* properties
	###

	data  : null
	title : null
	pages : null
	renderer : null
	lastPage : 1
	currentPage : 1
	totalPages : 0
	keyState : P.IDLE

	constructor : (target = 'body', renderer = R)->
		this.data = ""
		this.title = ""
		this.pages = []
		this.renderer = new renderer( target )

	load : ( target = "p.md" )->
		dfd = $.get( target )
		$.when(
			dfd
		)
		.done(
			(d)->
				this.data = d
		)
		.fail(
			(e)->
				throw e
		)
		return dfd

	parse : (data)->
		converter = new Showdown.converter()
		return converter.makeHtml( data )

	addPages : (md)->
		titleRegExp = /(<h1.+"?>.+<\/h1>)/
		title = md.match( titleRegExp )
		if title[0]?
			this.title = title[0]
		md = md.replace( titleRegExp, '')
		pageTitles = md.match(/(<h2.+"?>.+<\/h2>)/g)
		md = md.replace(/(<h2.+"?>.+<\/h2>)/g, P.SPLIT_STR )
		pageBodies = md.split( P.SPLIT_STR )
		pageBodies.shift()
		this.totalPages = pageTitles.length
		for pt, i in pageTitles
			this.pages.push( "#{pt}\n#{pageBodies[i]}" )

	setup : ->
		this.renderer.render( this )
		$(document).keydown( this.pageMove )
		$(document).keyup(
			(e)=>
				#console.info "keyup"
				this.keyState = P.IDLE
		)
		$(window).resize( this.renderer.resize )

	show : (pageNum = 1)->
		this.lastPage = this.currentPage
		this.currentPage = pageNum
		page = this.pages[pageNum - 1]
		this.renderer.showPage pageNum, this.lastPage
		return page

	pageMove : (e)=>
		return if this.keyState is P.FIRED
		switch e.keyCode
			when P.RIGHT
				this.next()
				this.keyState = P.FIRED
			when P.LEFT
				this.prev()
				this.keyState = P.FIRED
			when P.UP
				this.show( 1 )
				this.keyState = P.FIRED
			when P.DOWN
				this.show( this.totalPages )
				this.keyState = P.FIRED

	next : ->
		nextPage = if this.currentPage is this.totalPages then 1 else this.currentPage + 1
		this.show nextPage

	prev : ->
		prevPage = if this.currentPage is 1 then this.totalPages else this.currentPage - 1
		this.show prevPage

class R
	constructor : (target)->
		this.target = $(target)

	render : (p)->
		this.container = $(templates.page.render(
			{
				title : p.title
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

class S
	constructor : (target)->
		this.target = $(target)

	render : (p)->
		this.container = $(templates.page.render(
			{
			title : p.title
			pages : for page, i in p.pages
				pageNum : i + 1
				pageId : "page-#{i + 1}"
				zIndex : p.totalPages - i
				pageHtml : page
			}
		))
		this.target.append( this.container )
		$("div.page:nth-child(n+1)", this.container).hide()

		$("#p").on( "webkitAnimationStart", "div.page", ->

		)
		$("#p").on( "webkitAnimationEnd", "div.page", ->

		)
		this.resize()

	resize : (e)->
		t = $( "div.page", this.container )
		pageHeight = $(window).height()
		t.css(
			top : ( pageHeight - t.height() ) * 0.5
		)

	showPage : (page, lastPage)->
		if lastPage?
			$("#page-#{lastPage}").hide()
		$("#page-#{page}").show()

@p ||= {}
@p.P = P
@p.S = S
@p.R = R
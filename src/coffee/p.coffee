S = null
R = null

class P
	###
	* constatns
	###
	###*
	@property SPLIT_STR
	@static
	@default |||||
	@since 0.1.0
	###
	@SPLIT_STR : "|||||"
	###*
	@property LEFT
	@static
	@default 37
	@since 0.1.0
	###
	@LEFT : 37
	###*
	@property UP
	@static
	@default 38
	@since 0.1.0
	###
	@UP : 38
	###*
	@property RIGHT
	@static
	@default 39
	@since 0.1.0
	###
	@RIGHT : 39
	###*
	@property DOWN
	@static
	@default 40
	@since 0.1.0
	###
	@DOWN : 40

	###*
	@property IDLE
	@static
	@default 0
	@since 0.1.0
	###
	@IDLE : 0
	###*
	@property FIRED
	@static
	@default 1
	@since 0.1.0
	###
	@FIRED : 1

	###
	* properties
	###

	###*
	@property data
	@type Object
	@default null
	@since 0.1.0
	###
	data  : null
	###*
	@property title
	@type String
	@default null
	@since 0.1.0
	###
	title : null
	###*
	@property pages
	@type Array
	@default null
	@since 0.1.0
	###
	pages : null
	###*
	@property renderer
	@type Renderer
	@default null
	@since 0.1.0
	###
	renderer : null
	###*
	@property lastPage
	@type Number
	@default 1
	@since 0.1.0
	###
	lastPage : 1
	###*
	@property currentPage
	@type Number
	@default 1
	@since 0.1.0
	###
	currentPage : 1
	###*
	@property totalPages
	@type Number
	@default 1
	@since 0.1.0
	###
	totalPages : 0
	###*
	@property keyState
	@type Number
	@default P.IDLE
	@since 0.1.0
	###
	keyState : P.IDLE

	###*
	simple slide for presentation

	@class P
	@constructor
	@param {String} [target=body]
	@param {Renderer} [renderer=S]
	@since 0.1.0
	###
	constructor : (target = 'body', renderer = S)->
		this.data = ""
		this.title = ""
		this.pages = []
		this.renderer = new renderer( target )

	###*
	@method init
	@param [target=p.md] {String} path to markdown file to load
	@since 0.1.0
	###
	init : ( target = "p.md" )->
		myself = this
		dfd = $.Deferred()
		$.when( this.load target )
			.done(
				(d)->
					myself.addPages myself.parse( d )
					myself.setup()
					dfd.resolve()
			).fail(
				(e)->
					throw e
					dfd.reject()
			)
		return dfd.promise()

	###*
	@method load
	@param [target=p.md] {String} path to markdown file to load
	@since 0.1.0
	###
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

	###*
	@method parse
	@param data {Object} data object converted from md
	@since 0.1.0
	###
	parse : (data)->
		converter = new Showdown.converter()
		return converter.makeHtml( data )

	###*
	add pages to slide

	@method addPages
	@param md {String}
	@since 0.1.0
	###
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

	###*
	set up presentation!

	@method setup
	@since 0.1.0
	###
	setup : ->
		this.renderer.render( this )
		$(document).keydown( this.pageMove )
		$(document).keyup(
			(e)=>
				this.keyState = P.IDLE
		)
		$(window).swipe(
			swipe : this.pageMoveWithSwipe
		)
		$(window).resize( this.renderer.resize )
		this.restoreFromUrl()

	###*
	show a passed page

	@method show
	@param {Number} [pageNum=1] page number to show
	@since 0.1.0
	###
	show : (pageNum = 1)->
		this.lastPage = this.currentPage
		this.currentPage = pageNum
		page = this.pages[pageNum - 1]
		this.renderer.showPage pageNum, this.lastPage
		location.hash = "#" + pageNum
		return page

	###*
	event handler for page move

	@method pageMove
	@param {Event} e
	@protected
	@since 0.1.0
	###
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

	###
	restore page from url

	@method restoreFromUrl
	@since 0.1.2
	###
	restoreFromUrl : ->
		hash = location.hash.match(/#(\d+)/)
		if hash?.length > 1
			this.show parseInt( hash[1], 10 )

	###
	event handler for swipe(using jquery.touchSwipe.js)

	@method pageMoveWithSwipe
	###
	pageMoveWithSwipe : (e, dir, dist, duration, fingerCount) =>
		#return if this.keyState is P.FIRED
		switch dir
			when "right"
				this.next()
				#this.keyState = P.FIRED
			when "left"
				this.prev()
				#this.keyState = P.FIRED
			when "up"
				this.show( 1 )
				#this.keyState = P.FIRED
			when "down"
				this.show( this.totalPages )
				#this.keyState = P.FIRED

	###*
	show a next page

	@method next
	@since 0.1.0
	###
	next : ->
		nextPage = if this.currentPage is this.totalPages then 1 else this.currentPage + 1
		this.show nextPage

	###*
	show a prev page

	@method prev
	@since 0.1.0
	###
	prev : ->
		prevPage = if this.currentPage is 1 then this.totalPages else this.currentPage - 1
		this.show prevPage

define(
	["s", "r"]
	,(s, r)->
		S = s
		R = r
		return {
			P : P
			,S : S
			,R : R
		}
)
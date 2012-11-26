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

	constructor : (target = 'body', renderer = S)->
		this.data = ""
		this.title = ""
		this.pages = []
		this.renderer = new renderer( target )

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

@p ||= {}
@p.P = P
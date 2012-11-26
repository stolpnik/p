class S
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
		$("div.page", this.container).hide()
		$("div#page-1", this.container).show()

		$("#p").on( "webkitAnimationStart", "div.page", ->

		)
		$("#p").on( "webkitAnimationEnd", "div.page", ->

		)
		this.resize()

		$("h1", this.target).click(
			->
				if document.body.webkitRequestFullScreen?
					document.body.webkitRequestFullScreen()
		)

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

		#page no
		$("#current-page").text( page )

@p ||= {}
@p.S = S
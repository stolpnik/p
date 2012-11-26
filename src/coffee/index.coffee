p = @p
P = p.P
pr = null

_init = (d)->
	$("h1").click(
		->
			if document.body.webkitRequestFullScreen?
				document.body.webkitRequestFullScreen()
	)

$ ->
	pr = new P( "body", p.S )
	$.when( pr.init "p.md" )
	.done( _init )
p = @p
P = p.P
pr = null

_init = (d)->
	null

$ ->
	pr = new P( "body", p.S )
	$.when( pr.init "p.md" )
	.done( _init )
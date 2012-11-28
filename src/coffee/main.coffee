require [
		'jquery'
		'showdown'
		'hogan.min'
	]
	,($, showdown, hogan)->
		require [
				'templates.hogan'
				'p'
			]
			,( t, p )->
				P = p.P
				$ ->
					pr = new P( "body", p.S )
					$.when( pr.init "p.md" )
						.done( _init )

_init = (d)->
	console.log "start!!!"
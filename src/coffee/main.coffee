require [
		'jquery'
		'showdown'
		'hogan.min'
	]
	,->
		require [
				'templates.hogan'
				'p'
				's'
				'r'
			]
			,->
				p = @p
				P = p.P
				pr = null

				$ ->
					pr = new P( "body", p.S )
					$.when( pr.init "p.md" )
						.done( _init )

_init = (d)->
	console.log "start!!!"
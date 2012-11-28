P = null
R = null
S = null

require [
	'../../components/jquery/jquery'
	'../../app/js/showdown'
	'../../app/js/hogan.min'
]
,($, showdown, hogan) ->
	require [
		'../../app/js/templates.hogan'
	]
	,()->
		require ["p.test"], ->
			require ["../runner/runner"]
		return

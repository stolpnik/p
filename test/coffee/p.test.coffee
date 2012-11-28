P = null
S = null
R = null

define(
	["p"]
	,(p)->
		P = p.P
		S = p.S
		R = p.R
)

describe "p", ->
	presen = null
	beforeEach ->
		$(document).off("keyup")
		$(document).off("keydown")
		presen = new P()
		$("#p").remove()
	describe "load", ->
		it "load p.md file", (done)->
			dfd = presen.load()
			$.when(dfd).done(
				(d)->
					d.should.be.a("string")
					done()
			)
	describe "parse", ->
		it "parse p.md file with showdown", (done)->
			dfd = presen.load()
			$.when(dfd).done(
				(d)->
					html = presen.parse(d)
					html.should.be.a("string")
					done()
			)
	describe "addPages", ->
		it "split compiled markdown string to pages", (done)->
			dfd = presen.load()
			$.when(dfd).done(
				(d)->
					html = presen.parse(d)
					presen.addPages html
					presen.title.should.match(/<h1.+>.+<\/h1>/)
					presen.pages.should.be.a("array").with.length(4)
					done()
			)
	describe "setup", (done)->
		it "render a title", (done)->
			dfd = presen.load()
			$.when(dfd).done(
				(d)->
					html = presen.parse(d)
					presen.addPages html
					presen.setup()
					$("div#p").should.be.length(1)
					$("h1", $("div#p")).should.be.length(1)
					$("h1", $("div#p"))
					done()
			)
	describe "render S", (done)->
		it "show 1st page(default)", (done)->
			presen = new P( "body", S )
			dfd = presen.load()
			$.when(dfd).done(
				(d)->
					html = presen.parse(d)
					presen.addPages html
					presen.setup()
					$("#page-1").css("display").should.be.equal("block")
					done()
			)

	describe "render a page no", ->
		it "shows page 1/4", (done)->
			dfd = presen.load()
			$.when(dfd).done(
				(d)->
					html = presen.parse(d)
					presen.addPages html
					presen.setup()
					$("#current-page").text().should.be.equal('1')
					$("#total-pages").text().should.be.equal('4')
					done()
			)
		it "shows page 3/4", (done)->
			dfd = presen.load()
			$.when(dfd).done(
				(d)->
					html = presen.parse(d)
					presen.addPages html
					presen.setup()
					presen.show(3)
					$("#current-page").text().should.be.equal('3')
					$("#total-pages").text().should.be.equal('4')
					done()
			)


	describe "next", ->
		describe "render with S", ->
			beforeEach ->
				$(document).off("keyup")
				$(document).off("keydown")
				$("#p").remove()
				presen = new P( "body", S )
			it "render a next page", (done)->
				dfd = presen.load()
				$.when(dfd).done(
					(d)->
						html = presen.parse(d)
						presen.addPages html
						presen.setup()
						presen.next().should.be.match(/bbb/g)
						$("#page-1").css("display").should.be.equal("none")
						$("#page-2").css("display").should.be.equal("block")
						done()
				)


	describe "prev", ->
		describe "render with S", ->
			beforeEach ->
				$(document).off("keyup")
				$(document).off("keydown")
				$("#p").remove()
				presen = new P( "body", S )
			it "render a prev page", (done)->
				dfd = presen.load()
				$.when(dfd).done(
					(d)->
						html = presen.parse(d)
						presen.addPages html
						presen.setup()
						presen.prev().should.be.match(/ddd/g)
						$("#page-1").css("display").should.be.equal("none")
						$("#page-4").css("display").should.be.equal("block")
						done()
				)


describe "ui", ->
	presen = null
	beforeEach ->
		$(document).off("keyup")
		$(document).off("keydown")
		presen = new P( "body", S )
		$("#p").remove()
	afterEach ->
		$(document).trigger( $.Event("keyup") )
	describe "arrow key right", ->
		it "render a next page", (done)->
			dfd = presen.load()
			$.when(dfd).done(
				(d)->
					html = presen.parse(d)
					presen.addPages html
					presen.setup()
					e = $.Event("keydown")
					e.keyCode = P.RIGHT
					$(document).trigger(e)
					$("#page-1").css("display").should.be.equal("none")
					$("#page-2").css("display").should.be.equal("block")
					done()
			)
	describe "arrow key left", ->
		it "render a prev page", (done)->
			dfd = presen.load()
			$.when(dfd).done(
				(d)->
					html = presen.parse(d)
					presen.addPages html
					presen.setup()
					e = $.Event("keydown")
					e.keyCode = P.LEFT
					$(document).trigger(e)
					$("#page-1").css("display").should.be.equal("none")
					$("#page-4").css("display").should.be.equal("block")
					done()
			)
	describe "arrow key up", ->
		it "render a first page", (done)->
			dfd = presen.load()
			$.when(dfd).done(
				(d)->
					html = presen.parse(d)
					presen.addPages html
					presen.setup()
					e = $.Event("keydown")
					e.keyCode = P.UP
					$(document).trigger(e)
					$("#page-1").css("display").should.be.equal("block")
					$("#page-2").css("display").should.be.equal("none")
					done()
			)
	describe "arrow key down", ->
		it "render a last page", (done)->
			dfd = presen.load()
			$.when(dfd).done(
				(d)->
					html = presen.parse(d)
					presen.addPages html
					presen.setup()
					e = $.Event("keydown")
					e.keyCode = P.DOWN
					$(document).trigger(e)
					$("#page-1").css("display").should.be.equal("none")
					$("#page-4").css("display").should.be.equal("block")
					done()
			)
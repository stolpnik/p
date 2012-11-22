P = @p.P
R = @p.R
S = @p.S

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

	describe "next", ->
		describe "render with R", ->
			it "render a next page", (done)->
				dfd = presen.load()
				$.when(dfd).done(
					(d)->
						html = presen.parse(d)
						presen.addPages html
						presen.setup()
						presen.next().should.be.match(/bbb/g)
						$("#page-1").hasClass("flipPage").should.be.true
						done()
				)
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
		describe "render with R", ->
			it "render a prev page", (done)->
				dfd = presen.load()
				$.when(dfd).done(
					(d)->
						html = presen.parse(d)
						presen.addPages html
						presen.setup()
						presen.prev().should.be.match(/ddd/g)
						$("#page-1").hasClass("flipPage").should.be.true
						setTimeout(
							->
								$("#page-1").css("zIndex").should.be.equal('-4')
								done()
							,1250
						)
				)
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
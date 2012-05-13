test:
	./node_modules/.bin/mocha --reporter list

JQ.js: lib/JQ.js lib/parse-js.js lib/parser.js
	@node support/compile

.PHONY: test

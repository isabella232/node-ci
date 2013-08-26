REPORTER = spec
test:
	 @NODE_ENV=test ./node_modules/.bin/mocha -b --reporter $(REPORTER)

local:
	 heroku config:pull --overwrite \
	 exports GITHUB_PREFIX='LOCAL_'
	 foreman start

.PHONY: test

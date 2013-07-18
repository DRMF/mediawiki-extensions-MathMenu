# Makefile for JOBAd

# Build everything
all: deps js css doc templates libs
clean: clean-deps clean-templates clean-doc clean-release
libs: js-libs css-libs

# Get the dependencies
deps: npmdeps pipdeps
clean-deps:
	rm -rf node_modules
npmdeps:
	npm install gear gear-lib # To build compressed things
pipdeps:
	pip install markdown2 pygments beautifulsoup4 # To pip stuff

# Templates
templates:
	bash build/build-templates.sh
clean-templates:
	rm -rf examples/build

# Documentation
doc: pipdeps
	bash build/build-doc.sh
clean-doc:
	rm -rf doc/html 

# Just Build the release version
release: js css
clean-release:
	rm -rf build/release 

# JavaScript
js: js-dev js-min

js-dev: 
	bash build/build-js.sh
js-min: npmdeps js-dev
	bash build/build-js-min.sh
js-libs:
	echo "Null" # Not yet enabled

# CSS
css: css-dev css-min

css-dev: 
	bash build/build-css.sh
css-min: npmdeps css-dev
	bash build/build-css-min.sh
css-libs:
	echo "Null" # Not yet enabled
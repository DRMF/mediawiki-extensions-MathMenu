#!/bin/sh

mkdir -p "release"
build="release/JOBAD.js"
buildmin="release/JOBAD.min.js"
sourcedir=../js

# uses Clousre compiler bash script from https://github.com/dfsq/compressJS.sh

echo "JOBAD build script "

echo "Checking build requirements ..."

printf "Python ... "

if which python >/dev/null; then
	echo "OK"
else
	echo "FAIL"
	echo "Abort: Python not found. "
	echo "You might want to apt-get install python"
	exit 1
fi

printf "curl ... "

if which curl >/dev/null; then
	echo "OK"
else
	echo "FAIL"
	echo "Abort: CURL not found. "
	echo "You might want to apt-get install curl"
	exit 1
fi

printf "Compiling development version ... "


echo "/*" > $build
echo "	JOBAD v3" >> $build
echo "	Development version" >> $build
echo "	built: $(date -R)" >> $build
echo "*/" >> $build
echo "" >> $build

cat $sourcedir/JOBAD.core.js >> $build
echo "" >> $build
echo "/*" >> $build
echo "	JOBAD Core build configuration" >> $build
echo "*/" >> $build
echo "JOBAD.config.debug = false;" >> $build
echo "" >> $build
cat $sourcedir/JOBAD.ui.js >> $build
echo "" >> $build
cat $sourcedir/JOBAD.event.js >> $build

echo "OK"


printf "Preparing compilation with Closure Compiler ... "

echo "// ==ClosureCompiler==" > $buildmin.tmp
echo "// @compilation_level SIMPLE_OPTIMIZATIONS" >> $buildmin.tmp
echo "// ==/ClosureCompiler==" >> $buildmin.tmp
echo "" >> $buildmin.tmp

echo "var JOBAD = (function(){" >> $buildmin.tmp
cat $build >> $buildmin.tmp
echo "; return JOBAD; })();" >> $buildmin.tmp

echo "OK"

printf "Compiling minimized version ... "

echo "/*" > $buildmin
echo "	JOBAD v3" >> $buildmin
echo "	Minimized version" >> $buildmin
echo "	built: $(date -R)" >> $buildmin
echo "*/" >> $buildmin
echo "" >> $buildmin

./data/compressJS.sh $buildmin.tmp >> $buildmin

RETVAL=$?
[ $RETVAL -eq 0 ] && echo "OK"
[ $RETVAL -ne 0 ] && echo "FAIL" && rm $buildmin

printf "Cleaning up ... "

rm $buildmin.tmp

echo "OK"

echo ""
echo "Build finished. "

echo "Development version built successfully. "
[ $RETVAL -eq 0 ] && echo "Minimized version built successfully. "
[ $RETVAL -ne 0 ] && echo "Minimized version built failed. "

exit 0


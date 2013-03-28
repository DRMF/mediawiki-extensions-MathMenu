#!/bin/bash

# Constants
SERVICE_URL=http://closure-compiler.appspot.com/compile

# Check if files to compile are provided
if [ $# -eq 0 ]
then
	echo 'Nothing to compile. Specify input files as command arguments. E.g.'
	echo './compressjs file1.js file2.js file3.js'
	exit
fi

# Itearate through all files
for f in $*
do
	if [ -r ${f} ]
	then
		code="${code} --data-urlencode js_code@${f}"
	else
		echo "File ${f} does not exist or is not readable. Skipped."
	fi
done

# Send request
curl \
--url ${SERVICE_URL} \
--header 'Content-type: application/x-www-form-urlencoded' \
${code} \
--data output_format=json \
--data output_info=compiled_code \
--data output_info=statistics \
--data output_info=errors \
--data compilation_level=SIMPLE_OPTIMIZATIONS \
--silent |

python -c '
import json, sys

try:
	data = json.load(sys.stdin)
except:
	sys.exit(1)

if "errors" in data:
	sys.exit(1)
	
else:
	print data["compiledCode"]
	sys.exit(0)
' $@

exit $?

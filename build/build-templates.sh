#!/bin/bash

template_dir="../examples/templates"
template_build_dir="../examples/build"


rm -r -f $template_build_dir
mkdir $template_build_dir

jobad_base=".\/..\/..\/.."
jobad_script_full=""
while read filename
do
	jobad_script_full="$jobad_script_full<script src='$jobad_base\/js\/$filename'><\/script>\n"

done < "./config/files.txt"

jobad_release="<script src='$jobad_base\/build\/release\/JOBAD.min.js'><\/script>\n"
jobad_dev="<script src='$jobad_base\/build\/release\/JOBAD.js'><\/script>\n"


echo "Building JOBAD templates..."

while read template
do
	echo "Building Template: $template"
	mkdir "$template_build_dir/$template"

	cat "$template_dir/$template.html" | sed -e "s/\${JOBAD_BASE}/$jobad_base/" -e "s/\${JS_INCLUDE}/$jobad_script_full/" -e "s/\${BUILD_COMMENTS}/<!-- This file has been generated automatically. Any changes will be overwritten. -->/"> "$template_build_dir/$template/unbuilt.html"
	echo "Wrote $template/unbuilt.html"

	cat "$template_dir/$template.html" | sed -e "s/\${JOBAD_BASE}/$jobad_base/" -e "s/\${JS_INCLUDE}/$jobad_release/" -e "s/\${BUILD_COMMENTS}/<!-- This file has been generated automatically. Any changes will be overwritten. -->/"> "$template_build_dir/$template/release.html"
	echo "Wrote $template/release.html"

	cat "$template_dir/$template.html" | sed -e "s/\${JOBAD_BASE}/$jobad_base/" -e "s/\${JS_INCLUDE}/$jobad_dev/" -e "s/\${BUILD_COMMENTS}/<!-- This file has been generated automatically. Any changes will be overwritten. -->\n/"> "$template_build_dir/$template/dev.html"
	echo "Wrote $template/dev.html"
done < "./config/templates.txt"
echo "Templates build finished. "


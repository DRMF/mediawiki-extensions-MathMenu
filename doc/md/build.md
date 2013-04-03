# Building JOBAD

Although JOBAD is a javascript library, it is possible to build it. This concatenates all the required files into one and makes
it a lot shorter to include JOBAD into the website. 

Building is currently only supported on linux. To build you need to have python and curl installed on your system. You also need a working internet connection. 

The build script is "build/build.sh". It will create the files in "build/release". To create the minified version, it uses the [Closure Compiler](https://developers.google.com/closure/compiler/). 

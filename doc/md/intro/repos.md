# Module Repositories
The idea of repositories is not having to load modules manually. Repositories contain different modules, depending on the repository. 
To take a look which modules a repository provides, visit the repository url with your browser. 
To load some modules from a repository, use: 

```js
JOBAD.repo.loadFrom("/path/to/repo", ["a.sample.module"], function(s, msg){
    if(s){
        //success; modules have been loaded
    } else {
        //failed to load modules, msg will contain a reason
    }
});
``` 
## Providing your own repository
To provide your own repository, all you need is a static WebServer. Each repository is in its own directory. It contains three types of files: 

* `index.html` - An index pages which automatically provides some information about the contained modules. 
* `__jobad_repo__.js` - A file containing general joabd repository information. 
* Module files, named `[id_of_module].js`

A sample repository can be found in the [`modules`](../../../modules/index.html) folder of the main repository. It can be used as a template. 
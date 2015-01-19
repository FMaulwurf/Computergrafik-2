
/*
 * This is main.js which is referenced directly from within
 * a <script> node in index.html
 */

// "use strict" means that some strange JavaScript things are forbidden
"use strict";

// this shall be the function that generates a new phone book object
var makePath = function(separator) {
    var path="";
    var f = function add(arg){
        if (typeof arg === 'undefined')
            return path;
        if(path=="")
            return path += arg;
        else
            return path += separator + arg;
    };
    return f;
};

// the main() function is called when the HTML document is loaded
var main = function() {
	// create a path, add a few points on the path, and print it
	var path1 = makePath(",");
	path1("A");
	path1("B");
	path1("C");
    path1(1);
    path1(8);
    path1(10);
	window.console.log("path 1 is " + path1() );

};

// Function.name polyfill for IE9+ 
// Remake of https://github.com/JamesMGreene/Function.name/blob/master/Function.name.js

var fnNamePrefixRegex = /^[\S\s]*?function\s*/;
var fnNameSuffixRegex = /[\s\(\/][\S\s]+$/;

// Inspect the polyfill-ability of this browser
var needsPolyfill = !("name" in Function.prototype && "name" in (function x() {}));

// Polyfill it!
if (needsPolyfill) {
	Object.defineProperty(Function.prototype, "name", {
		get: function() {
			var name = "";
			if (this === Function || this === Function.prototype.constructor) {
				name = "Function";
			}
			else if (this !== Function.prototype) {
				name = ("" + this).replace(fnNamePrefixRegex, "").replace(fnNameSuffixRegex, "");
			}
			return name;
		}
	});
}

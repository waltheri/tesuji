/** serialization function */

var Model = require("../Model");

var unserialize_rec = function(obj) {
	var constructor, temp;
	
	if(obj != null && typeof obj == "object") {
		if(obj.constructor == null) {
			// standard object
			temp = {};
		}
		else if(obj.constructor == "function") {
			// function
			temp = eval("("+obj.arg+")");
		}
		else {
			// construct object by constructor
			if(this && typeof this[obj.constructor] == "function") {
				// from global scope
				constructor = this[obj.constructor];
			}
			else if(typeof Model.registry[obj.constructor] == "function") {
				// from Model registry
				constructor = Model.registry[obj.constructor];
			}
			else if(constructor = Model.load(obj.constructor)) {
				// using autoloader
			}
			else {
				// plain object
				constructor = Object;
			}
			
			if(obj.arg === undefined) temp = new constructor();
			else temp = new constructor(unserialize_rec(obj.arg));
		}
		
		if(obj.value) {
			for(var key in obj.value) {
				if(obj.value.hasOwnProperty(key)) temp[key] = unserialize_rec(obj.value[key]);
			}		
		}
		
		return temp;
	}
	else {
		return obj;
	}
	
}

var unserialize = function(json_str) {
	var obj = JSON.parse(json_str);
	
	Model.dontInit = true;
	var result = unserialize_rec(obj);
	Model.dontInit = false;
	
	return result;
}

module.exports = unserialize;

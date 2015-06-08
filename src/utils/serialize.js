/** serialization function */

var Model = require("../Model");
var Component = require("../Component");

var serialize_rec = function(obj, result, stack) {
	if(obj instanceof HTMLElement) {
		throw new TypeError("You can't serialize HTML element.");
	}
	else if(obj instanceof Model) {
		result.__model__ = obj.constructor.name;
	}
	else if(obj instanceof Model.Array) {
		result.__model__ = obj.constructor.name;
	}
	else if(obj instanceof Component) {
		result.__component__ = obj.constructor.name;
	}
	
	var value, keys;
	
	if(obj.__sleep) keys = obj.__sleep();
	else keys = Object.keys(obj);
	
	stack.push(obj);
	
	for(var i = 0; i < keys.length; i++) {
		value = obj[keys[i]];
		
		if(value != null && typeof value == "object") {
			if(stack.indexOf(value) >= 0) continue;
			
			result[keys[i]] = {};
			serialize_rec(value, result[keys[i]], stack);
		}
		else if(typeof value == "function") {
			throw new TypeError("You can't serialize function.");
		}
		else {
			result[keys[i]] = value;
		}
	}
	
	stack.pop(obj);
}

var serialize = function(obj, indent) {
	var result;
	
	if(obj != null && typeof obj == "object") {
		result = {};
		serialize_rec(obj, result, []);
	}
	else if(typeof obj == "function") {
		throw new TypeError("You can't serialize function.");
	}
	else {
		result = obj;
	}
	
	return JSON.stringify(result, null, indent || 0);
}

module.exports = serialize;

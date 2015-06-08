/** serialization function */

var Model = require("../Model");
var Component = require("../Component");

var unserialize_rec = function(obj) {
	var temp

	if(result.__model__) {
		if(result.__model__ == "Model") {
			delete result.__model__;
			return new Model(obj);
		}
	}
	
	
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

var unserialize = function(json_str) {
	var obj = JSON.parse(json_str);
	
	if(obj != null && typeof obj == "object") {
		return unserialize_rec(obj);
	}
	else {
		return obj;
	}
}

module.exports = unserialize;

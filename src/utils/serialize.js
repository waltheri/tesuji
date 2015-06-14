/** serialization function */

require("./functionNamePolyfill");

var serialize_rec = function(obj, stack) {
	var result;
	
	if(typeof obj == "function") {
		// function value
		result = {
			constructor: "function",
			arg: obj.toString()
		};
	}
	else if(obj == null || typeof obj !=  "object") {
		// primitive value
		return obj;
	}
	else if(stack.indexOf(obj) >= 0) {
		// cyclic data structure
		throw new TypeError("Can't serialize cyclic data structure.");
	}
	else if(obj.constructor.name && obj.constructor.name != "Object") {
		// object with constructor
		result = {
			constructor: obj.constructor.name
		}
	}
	else {
		// standard or anonymous object
		result = {};
	}
	
	// get object properties
	var temp, keys, arg;
	if(obj.__sleep) {
		temp = obj.__sleep();
		keys = temp.keys;
		arg = temp.arg;
	}
	else {
		keys = Object.keys(obj);
	}
	
	if(keys) {
		// value property
		if(obj instanceof Array) result.value = [];
		else result.value = {};
		
		stack.push(obj);
		for(var i = 0; i < keys.length; i++) {
			result.value[keys[i]] = serialize_rec(obj[keys[i]], stack);
		}
		stack.pop(obj);
	}
	if(arg) {
		// arg property
		stack.push(obj);
		result.arg = serialize_rec(arg, stack);
		stack.pop(obj);
	}
	return result;
}

var serialize = function(obj, indent) {
	return JSON.stringify(serialize_rec(obj, []), null, indent || 0);
}

module.exports = serialize;

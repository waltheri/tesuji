/** Variables with reuired type */

require("./functionNamePolyfill");

var ConditionVariable = require("./ConditionVariable");

var Type = function(type, initialValue) {
	ConditionVariable.call(this, initialValue == null ? new type() : initialValue);
	this.type = type;
	this.typeName = type.name;
}

Type.prototype = Object.create(ConditionVariable.prototype);
Type.prototype.constructor = Type;
Type.prototype.test = function(value, key) {
	if(value.constructor != this.type) {
		throw new TypeError("Value of the property '"+key+"' is expected to be '"+this.typeName+"', trying to assign instance of '"+value.constructor.name+"'.");
	}
	else return true;
}

/* factory method of Type */
var typeOf = function(type, initialValue) {
	/* todo add possibility of mixed types */
	return new Type(type, initialValue);
}

var PrimitiveType = function(type, initialValue) {
	ConditionVariable.call(this, initialValue);
	this.type = type;
}

PrimitiveType.prototype = Object.create(ConditionVariable.prototype);
PrimitiveType.prototype.constructor = PrimitiveType;
PrimitiveType.prototype.test = function(value, key) {
	if(typeof value != this.type) {
		throw new TypeError("Value of the property '"+key+"' is expected to be type of '"+this.type+"', trying to assign variable type of '"+(typeof value)+"'.");
	}
	else return true;
}

/* factory method of PrimititveType*/
var primitiveType = function(type) {
	return function(initialValue) {
		return new PrimitiveType(type, initialValue);
	}
}

// export

Type.PrimitiveType = PrimitiveType;
Type.typeOf = typeOf;
Type.string = primitiveType("string");
Type["boolean"] = primitiveType("boolean");
Type.number = primitiveType("number");

module.exports = Type;

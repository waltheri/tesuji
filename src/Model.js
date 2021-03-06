/**
 * Cool observables
 *
 * @exports observableObject
 */

"use strict";

var events = require("./utils/events");
var ConditionVariable = require("./utils/ConditionVariable");
var Subscribable = require("./utils/Subscribable");

/* TEMPORARY Computed object */

var Computed = function Computed(readFn, writeFn, context) {
	this.readFn = readFn;
	this.writeFn = writeFn;
	this.context = context;
}

/** deeply freeze an object to make it fully immutable */
var deepFreeze = function(obj) {
	if(obj == null || typeof obj != 'object' || Object.isFrozen(obj) || obj._keepHot) return;

	Object.freeze(obj); // First freeze the object.
	
	for (var key in obj) {
		if(obj.hasOwnProperty(key)) deepFreeze(obj[key]); // Recursively call deepFreeze.
	}
}

var setValue = function(context, value, key) {
	// not null check
	if(value == null && context.notNull) throw new TypeError("Trying to assign null to the property '"+key+"', but value of an observable property cannot be null (or undefined).");
	if(context.condition != null) context.condition.test(value, key);
	
	context.value = value
}
	
var createPropertyDescriptor = function(obj, key, parent) {
	var context = {
		value: undefined,
		condition: null,
		notNull: false,
		subscription: null
	}
	
	if(obj[key] instanceof ConditionVariable) {
		context.condition = obj[key];
		context.value = obj[key].initialValue;
	}
	else if(obj[key] instanceof Computed) {
		// computed variable
		var descriptor = {
			enumerable: false
		}
		
		// save object
		context.value = obj[key];
		
		// read function
		if(context.value.readFn) {
			descriptor.get = context.value.readFn.bind(context.value.context == null ? parent : context.value.context);
		}
		
		// write function
		if(context.value.writeFn) {
			descriptor.set = context.value.writeFn.bind(context.value.context == null ? parent : context.value.context);
		}
		
		return descriptor;
	}
	else if(obj[key] && typeof obj[key].subscribe == "function" && typeof obj[key].unsubscribe == "function") {
		context.subscription = function() {
			parent.notify(key, obj[key]);
		}
		obj[key].subscribe(context.subscription);
		
		context.value = obj[key];
	}
	else {
		context.value = obj[key];
	}
	
	deepFreeze(context.value);
	
	return {
		enumerable: true,
		get: function() {
			// trigger getter event
			events.trigger("observable.get", context.value, parent, key);
			
			return context.value;
		},
		set: function(new_val) {
			//setValue(context, new_val, key);
			// not null check
			if(new_val == null && context.notNull) throw new TypeError("Trying to assign null to the property '"+key+"', but value of an observable property cannot be null (or undefined).");
			if(context.condition != null) context.condition.test(new_val, key);
			
			if(context.subscription) {
				context.value.unsubscribe(context.subscription);
				context.subscription = null;
			}
			
			if(new_val && typeof new_val.subscribe == "function" && typeof new_val.unsubscribe == "function") {
				context.subscription = function() {
					parent.notify(key, new_val);
				}
				new_val.subscribe(context.subscription);
			}
			
			context.value = new_val;
			deepFreeze(context.value);

			parent.notify(key, new_val);
		}
	}
}

var initObservableInstance = function(source) {
	var properties = {};
	
	for(var key in source) {
		if(source.hasOwnProperty(key)) {
			properties[key] = createPropertyDescriptor(source, key, this);
		}
	}
	
	// define properties
	Object.defineProperties(this, properties);
	
	// seal object
	Object.seal(this);
}

/**
 * Create model class with a subscribable interface.
 */
 
var makeModelClass = function(parentClass, constructor) {
	// inherits methods from parent class
	constructor.prototype = Object.create(parentClass.prototype);
	
	// inherits methods from Subscribable class 
	for(var key in Subscribable.prototype) {
		constructor.prototype[key] = Subscribable.prototype[key];
	}
	
	constructor.prototype.constructor = constructor;
	constructor.prototype._keepHot = true;
	
	return constructor;
}

/* generic Model */
var Model = makeModelClass(Object, function Model(source) {
	// call Subscribable constructor
	Subscribable.call(this);
	
	// init model
	initObservableInstance.call(this, source);
	
	if(!Model.dontInit && this.__init) this.__init();
});

Model.prototype.__sleep = function() {
	var arg = {};
	
	for(var key in this) {
		if(this.hasOwnProperty(key)) arg[key] = this[key];
	}
	
	return {
		arg: arg
	}
}

/* Model Array */
var ModelArray = makeModelClass(Array, function ModelArray(source) {
	// call Subscribable constructor
	Subscribable.call(this);
	
	this.length = 0;
	
	source = source || [];
	
	for(var i = 0; i < source.length; i++) {
		// use old method for initialization
		Array.prototype.push.call(this, source[i]);
	}
});

var arrayAlteringMethods = ["pop", "push", "reverse", "shift", "unshift", "splice", "sort"];

var alteredArrayMethod = function(name) {
	return function() {
		var response = Array.prototype[name].apply(this, arguments);
		this.notify();
		return response;
	}
}

for(var i = 0; i < arrayAlteringMethods.length; i++) {
	ModelArray.prototype[arrayAlteringMethods[i]] = alteredArrayMethod(arrayAlteringMethods[i]);
}

ModelArray.prototype.__sleep = function() {
	return {
		arg: this.slice()
	}
}

// registry of models
Model.registry = {
	Model: Model,
	ModelArray: ModelArray
};

Model.dontInit = false;

Model.Array = ModelArray;
Model.extend = function(constructor) {
	var submodel = new Function("constructor", "Model", "return function "+constructor.name+"() { constructor.apply(this, arguments); Model.call(this, this); };")(constructor, Model);
	
	submodel.prototype = Object.create(Model.prototype);
	submodel.prototype.constructor = submodel;
	submodel.prototype.__sleep = null;
	
	if(constructor.name) Model.registry[constructor.name] = submodel;
	
	return submodel;
}

Model.computed = function(readFn, writeFn, context) {
	return new Computed(readFn, writeFn, context);
}

// autoloader function of model
Model.load = function(model) {
	// it does nothing - need to be overriden
}

// export it
module.exports = Model;

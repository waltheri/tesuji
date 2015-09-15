/** data-with handler */
/* value = <model> */

var ElementAttributeBinding = require("./ElementAttributeBinding");

module.exports = ElementAttributeBinding.extend({
	read: function(model) {
		if(typeof model != "object") throw TypeError("Attribute data-with accepts objects or arrays, '"+(typeof model)+"' was given.");
		
		var bindComponent = require("../Component.js").bind;
		bindComponent(this.context.domElement, model, this.context.model);

		this.context.stopTraversing();
	},
}, 'with');

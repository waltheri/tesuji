/** data-with handler */
/* value = <model> */

var ElementAttributeBinding = require("./ElementAttributeBinding");

module.exports = ElementAttributeBinding.extend({
	read: function(value) {
		var tesuji = require("../tesuji.js");
		
		if(typeof value != "object") throw TypeError("Attribute data-with accepts objects or arrays, '"+(typeof value)+"' was given.");
		
		tesuji.applyModel(this.context.domElement, value, this.context.model);

		this.context.stopTraversing();
	},
}, 'with');

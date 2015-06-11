/** data-template handler */
/* value = <template> */

var ElementAttributeBinding = require("./ElementAttributeBinding");

module.exports = ElementAttributeBinding.extend({
	read: function(template) {
		var bindComponent = require("../Component.js");
		bindComponent(this.context.domElement, null, this.context.model, template);
		
		this.context.stopTraversing();
	},
}, 'template');

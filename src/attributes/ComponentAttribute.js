/** data-component handler */
/* value = <component> */

var ElementAttributeBinding = require("./ElementAttributeBinding");

module.exports = ElementAttributeBinding.extend({
	read: function(component) {
		var bindComponent = require("../Component.js").bind;
		bindComponent(this.context.domElement, component.model, this.context.model, component.template);
		
		this.context.stopTraversing();
	},
}, 'component');

/** data-component handler */
/* value = <component> */

var ElementAttributeBinding = require("./ElementAttributeBinding");

module.exports = ElementAttributeBinding.extend({
	read: function(component) {
		var Component = require("../Component");
		
		if(component == null) {
			component = new Component.Empty({});
		}
		else if(!(component instanceof Component)) throw TypeError("Attribute data-component accepts instances of 'Component', instance of '"+(component.constructor && component.constructor.name ? component.constructor.name  : "[unknown]")+"' was given.");
		
		if(this.context.domElement.tesujiComponent) this.context.domElement.tesujiComponent.unbind();
		
		component.parentModel = this.context.model;
		component.bind(this.context.domElement);
		
		this.context.stopTraversing();
	},
}, 'component');

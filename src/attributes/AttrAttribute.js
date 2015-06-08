/** data-attr handler */

/* value = Object with attributes definitions */
var ElementAttributeBinding = require("./ElementAttributeBinding");

module.exports = ElementAttributeBinding.extend({
	read: function(attributes) {
		if(typeof attributes != "object") throw TypeError("Attribute data-attr accepts objects, '"+(typeof attributes)+"' was given.");
		
		for(var key in attributes) {
			if(attributes.hasOwnProperty(key)) {
				if(attributes[key] != null && attributes[key].valueOf() !== false) {
					this.context.domElement.setAttribute(key, attributes[key]);
				}
				else {
					this.context.domElement.removeAttribute(key);
				}
			}
		}
	}
}, 'attr');

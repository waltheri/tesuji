/** data-text handler */

var ElementAttributeBinding = require("./ElementAttributeBinding");

module.exports = ElementAttributeBinding.extend({
	read: function(value) {
		if(value) {
			this.context.domElement.disabled = true;
		}
		else {
			this.context.domElement.disabled = false;
		}
	}
}, 'disabled');

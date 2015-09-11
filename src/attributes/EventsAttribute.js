/** data-on* handler */
/* callback = event callback */

var ElementAttributeBinding = require("./ElementAttributeBinding");

var vendorEvents = {
	'transitionend': ['webkitTransitionEnd']
}

module.exports = ElementAttributeBinding.extend({
	event: function(callback) {
		var evName = this.name.substring(2);

		this.event_callback = callback;
		
		this.context.domElement.addEventListener(evName, callback);
		if(vendorEvents[evName]) {
			for(var i = 0; i < vendorEvents[evName].length; i++) {
				this.context.domElement.addEventListener(vendorEvents[evName][i], callback);
			}
		}
	},
	clean: function() {
		var evName = this.name.substring(2);
		
		this.context.domElement.removeEventListener(evName, this.event_callback);
		if(vendorEvents[evName]) {
			for(var i = 0; i < vendorEvents[evName].length; i++) {
				this.context.domElement.removeEventListener(vendorEvents[evName][i], this.event_callback);
			}
		}
		delete this.event_callback;
	}
}, /on.*/i);
/* index.js */

var Component = require("./src/Component");

var tesuji = {
	Component: Component,
	Model: require("./src/Model"),
	/*applyModel: function(rootElement, model) {
		// handle parameters
		if(model == null) {
			model = rootElement;
			rootElement = document.body;
		}
		
		var component = new Component.FixedComponent(rootElement);
		component.setModel(model);
	},*/
	Type: require("./src/utils/Type")
}

if(module && module.exports) {
	module.exports = tesuji;
}

window.tesuji = tesuji;

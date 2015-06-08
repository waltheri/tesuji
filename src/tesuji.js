/* index.js */

//var Component = require("./Component");

var tesuji = {
	Component: require("./Component"),
	Model: require("./Model"),
	applyModel: function(rootElement, model, parentModel) {
		// handle parameters
		if(!(rootElement instanceof HTMLElement)) {
			parentModel = model;
			model = rootElement;
			rootElement = document.body;
		}

		var component = rootElement.tesujiComponent || new this.Component.FixedComponent(rootElement);
		component.parentModel = parentModel;
		component.applyModel(model);
		
		return component;
	},
	Type: require("./utils/Type")
}

if(module && module.exports) {
	module.exports = tesuji;
}

window.tesuji = tesuji;

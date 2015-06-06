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
		
		var component = rootElement.tesujiComponent;
		if(component) {
			component.parentModel = parentModel;
			component.updateModel(model);
		}
		else {
			component = new this.Component.FixedComponent(rootElement);
			component.parentModel = parentModel;
			component.setModel(model);
		}
		
		return component;
	},
	Type: require("./utils/Type")
}

if(module && module.exports) {
	module.exports = tesuji;
}

window.tesuji = tesuji;

/* index.js */

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

		this.Component.bind(rootElement, model, parentModel);
	},
	Type: require("./utils/Type")
}

if(module && module.exports) {
	module.exports = tesuji;
}

window.tesuji = tesuji;

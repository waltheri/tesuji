/* index.js */

var tesuji = {
	bindComponent: require("./Component"),
	Model: require("./Model"),
	applyModel: function(rootElement, model, parentModel) {
		// handle parameters
		if(!(rootElement instanceof HTMLElement)) {
			parentModel = model;
			model = rootElement;
			rootElement = document.body;
		}

		this.bindComponent(rootElement, model, parentModel);
	},
	Type: require("./utils/Type")
}

if(module && module.exports) {
	module.exports = tesuji;
}

window.tesuji = tesuji;

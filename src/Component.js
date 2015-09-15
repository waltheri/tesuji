/**
 * Component class.
 *
 * @exports component
 */

var registeredComponents = {}; //require(""); - something here
var registeredAttributes = require("./attributes/attributeHandlers"); 

/* BindingContext class */

var ElementBindingContext = function(domElement, model, parent) {
	this.domElement = domElement;
	this.model = model;
	this.parent = parent;
	this.traverseChildren = true;
	this.bindings = [];
}

ElementBindingContext.prototype = {
	constructor: ElementBindingContext,
	
	stopTraversing: function() {
		this.traverseChildren = false;
	},
	
	keepTraversing: function() {
		return this.traverseChildren;
	},
	
	addBinding: function(binding) {
		this.bindings.push(binding);
	},
	
	clearBindings: function() {
		var binding;
		while(binding = this.bindings.pop()) binding.clean();
	},
	
	rebind: function(model, parent) {
		this.clearBindings();
		this.model = model;
		this.parent = parent;
		this.traverseChildren = true;
	}
}

/* traverse DOM tree */
var applyModelOnDOMElement = function(domElement, model, parent) {
	if(domElement.nodeType !== Node.ELEMENT_NODE) return;
	
	var attributeName;
	
	if(domElement.tesujiBindingContext == null) domElement.tesujiBindingContext = new ElementBindingContext(domElement, model, parent);
	else domElement.tesujiBindingContext.rebind(model, parent);
	
	if(registeredComponents[domElement.nodeName]) {
		// handle specially
	}
	else {
		for(var i = 0; i < domElement.attributes.length; i++) {
			if(domElement.attributes[i].name.search('data-') === 0) {
				// this a data attribute
				attributeName = domElement.attributes[i].name.substring(5);
				
				processDataAttribute(attributeName, domElement.attributes[i].value, domElement.tesujiBindingContext);
			}
		}
	}
	
	if(domElement.tesujiBindingContext.keepTraversing()) {
		for(var i = 0; i < domElement.children.length; i++) {
			applyModelOnDOMElement(domElement.children[i], model, parent);
		}
	}

}

/* process data attribute */
var processDataAttribute = function(name, value, elementBindingContext) {
	var binding;
	
	for(var i = 0; i < registeredAttributes.length; i++) {
		if((registeredAttributes[i].pattern.constructor == String && registeredAttributes[i].pattern == name) || (registeredAttributes[i].pattern.constructor == RegExp && name.search(registeredAttributes[i].pattern) >= 0)) {
			binding = new registeredAttributes[i](name, value, elementBindingContext);
			elementBindingContext.addBinding(binding);
			binding.apply();
		}
	}
}

/** Destroy all bindings of the DOM element on the model (opposite of applyModelOnDOMElement) */

var removeModelFromDOMElement = function(domElement) {
	if(domElement.nodeType !== Node.ELEMENT_NODE) return;
	if(domElement.tesujiBindingContext == null) return;
	
	if(domElement.tesujiBindingContext.keepTraversing()) {
		for(var i = 0; i < domElement.children.length; i++) {
			removeModelFromDOMElement(domElement.children[i]);
		}
	}
	
	domElement.tesujiBindingContext.clearBindings();
}

/**
 * Immutable component class
 *
 * HTML template and model are immutable - they cannot be changed after the component is initialized.
 *
 * ImmutableComponent class itself is an abstract class - it doesn't contain any template. However, you can extended it with a template and create your own component class.
 * Be aware that HTML template != HTML output, HTML output is HTML template enriched with the model data, and even it can be composed from multiple copies of the template. 
 * So HTML output is mutable and depends on the model.
 *
 * Component objects contain method inject(?), which can be used to insert component into the DOM. And the component can be injected into any element any time.
 */
 
/*var ImmutableComponent = function ImmutableComponent(model) {
	Component.call(this);
	this.model = this.createModel(model);
}

ImmutableComponent.prototype = Object.create(Component.prototype);
ImmutableComponent.prototype.constructor = ImmutableComponent;*/

/**
 * Bind the component to the DOM element and produce output.
 */
	 
/*ImmutableComponent.prototype.bind = function(element) {
	// set parent element
	this.parentElement = element;
	this.parentElement.tesujiComponent = this;
	
	if(this.built) {
		// reinsert template nodes into parent element
		this.parentElement.innerHTML = "";
		
		for(var i = 0; i < this.templateNodes.length; i++) {
			for(var j = 0; j < this.templateNodes[i].length; j++) {
				this.parentElement.appendChild(this.templateNodes[i][j]);
			}
		}
	}
	else {
		// fill element.innerHTML with the template
		this.parentElement.innerHTML = this.template;
		
		// save template nodes
		this.templateNodes.push(Array.prototype.slice.call(this.parentElement.childNodes));
		
		// apply model
		this.applyModel();
	}
}*/

/**
 * Unbind the component from the DOM element.
 */
	 
/*ImmutableComponent.prototype.unbind = function() {
	this.parentElement.tesujiComponent = null;
	this.parentElement = null;
}*/

/**
 * Binded component class
 *
 * It differs from the basic component in the fact, it doesn't contain its template. It uses HTML content of its parent DOM element as the template.
 * Also it has mutable model - it can be changed. On the other side instance is strictly binded to its parent DOM element.
 */
 
/*var FixedComponent = function FixedComponent(parentElement) {
	if(parentElement == null) throw new TypeError("Property 'parentElement' must not be null.");
	
	Component.call(this);
	
	// set parent element - it cannot be changed
	this.parentElement = parentElement;
	this.parentElement.tesujiComponent = this;
	
	// save template html
	this.template = parentElement.innerHTML;
	
	// save template nodes
	this.templateNodes.push(Array.prototype.slice.call(this.parentElement.childNodes));
}

FixedComponent.prototype = Object.create(Component.prototype);
FixedComponent.prototype.constructor = FixedComponent;

// registry of components
Component.registry = {};*/

/**
 * Possible calls:
 * 
 * 1) component(String template[, String name, Function mappingFunction])
 *    Predefine component - its instances can be injected into the DOM
 *
 * 2) component(DOMElement element, <Model> model)
 *    create component 'on the fly' and fill it with the model
 * 
 * 3) component()
 *    return Component class
 */

/*Component.fromHTML = function(template, name) {
	if(typeof template != "string") {
		throw new TypeError("Function 'Component.fromHTML' argument must be type of 'string'.");
	}
	
	// create a subclass of the Component
	name = name || "";
	var NewComponent = new Function("ImmutableComponent", "return function "+name+"(model) { ImmutableComponent.call(this, model); };")(ImmutableComponent);

	NewComponent.prototype = Object.create(ImmutableComponent.prototype);
	NewComponent.prototype.constructor = NewComponent;
	
	// save its template
	NewComponent.prototype.template = template;
	
	if(name) Component.registry[name] = NewComponent;
	
	return NewComponent;
}

Component.FixedComponent = FixedComponent;
Component.Empty = Component.fromHTML("", "Empty");*/

// jQuery.html()
var rxhtmlTag = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi;
var rtagName = /<([\w:]+)/;
var rnoInnerhtml = /<(?:script|style|link)/i;
var wrapMap = {
	// Support: IE9
	option: [1, "<select multiple='multiple'>", "</select>"],

	thead: [1, "<table>", "</table>" ],
	col: [2, "<table><colgroup>", "</colgroup></table>"],
	tr: [2, "<table><tbody>", "</tbody></table>"],
	td: [3, "<table><tbody><tr>", "</tr></tbody></table>"],

	_default: [ 0, "", "" ]
};

var htmlToElem = function(elem, html) {
	
	// See if we can take a shortcut and just use innerHTML
	if(!rnoInnerhtml.test(html) && !wrapMap[(rtagName.exec(html) || ["", ""])[1].toLowerCase()]) {
		html = html.replace(rxhtmlTag, "<$1></$2>");
		try {
			elem.innerHTML = html;
			elem = 0;

		// If using innerHTML throws an exception, use the fallback method
		} catch(e) {}
	}
	
	if(elem) {		
		var tmp = document.createElement("div");

		// Deserialize a standard representation
		var tag = (rtagName.exec(html) || ["", ""])[1].toLowerCase();
		var wrap = wrapMap[tag] || wrapMap._default;
		
		tmp.innerHTML = wrap[1] + html.replace(rxhtmlTag, "<$1></$2>") + wrap[2];

		// Descend through wrappers to the right content
		var i = wrap[0];
		while(i--) {
			tmp = tmp.lastChild;
		}
		
		elem.innerHTML = "";
	
		while(tmp.childNodes.length) {
			elem.appendChild(tmp.childNodes[0]);
		}
	}
}

/** Enhanced component system */

/**
 * Component class
 * It binds dynamic data to HTML element.
 */
 
var Component = function Component(domElement) {
	this.domElement = domElement;
	this.template = "";
	this.templateNodes = [];
	this.model = [];
	this.parentModel = null;
	this.built = false;
}

Component.prototype = {
	constructor: Component,
	
	/**
	 * Sets a template of the component.
	 *
	 * Argument can be template string or null - current content of the element will be used as the template.
	 */
	
	setTemplate: function(template) {
		// unbind old models from old dom elements
		this.unbindAll();
		
		if(template == null) {
			// save template html
			this.template = this.domElement.innerHTML;
		}
		else {
			// set template string
			this.template = template;
		
			// fill element.innerHTML with the template
			//this.domElement.innerHTML = template;
			htmlToElem(this.domElement, this.template);
		}
		
		// set built flag as false
		this.built = false;
		
		// save template nodes
		this.templateNodes = [Array.prototype.slice.call(this.domElement.childNodes)];
	},
	
	/**
     * Compares templates - needs to be optimalized in the future release
	 */
	
	containsTemplate: function(template) {
		return template == null || this.template == template;
	},
	
	/**
	 * Converts a model to supported form (array)
	 */

	prepareModel: function(model) {
		return (model instanceof Array) ? model.slice() : [model];
	},
		
	/**
	 * Apply *initial* model on the template
	 */
	 
	applyModel: function(model, parentModel) {
		if(model == null) model = this.model;
		
		this.parentModel = parentModel; // CHANGING OF parentModel CURRENTLY NOT SUPPORTED
		
		model = this.prepareModel(model);
		
		if(this.built) {
			this.updateModel(model);
		}
		else {
			this.model = model;
			
			if(this.model.length == 0) {
				// no model item - don't render any HTML
				this.domElement.innerHTML = "";
				this.templateNodes = [];
			}
			else {
				// first template copy already in the DOM
				this.bindModel(0);
				
				// multiple injections
				for(var i = 1; i < this.model.length; i++) {
					// for other instances we need to clone
					this.cloneTemplateNodes();
					this.bindModel(i);
				}
			}
			
			this.built = true;
		}
	},
	
	/**
	 * Private function - updates model
	 */
	
	updateModel: function(newModel) {
		var oldPos;

		for(var i = 0; i < newModel.length; i++) {
			oldPos = this.model.indexOf(newModel[i]);
			
			if(oldPos >= 0) {
				// model already in the DOM
				if(i != oldPos) {
					// adjust template
					this.moveTemplateNodes(oldPos, i);
					// and model
					this.model.splice(i, 0, this.model.splice(oldPos, 1)[0]);
				}				
			}
			else {
				// check whether current old model is in a new model array
				if(this.templateNodes[i] && newModel.indexOf(this.model[i]) == -1) {
					// just replace model at i
					this.model[i] = newModel[i];
					// bind model and template nodes
					this.bindModel(i);
				}
				else {
					// insert templateNodes at i
					this.cloneTemplateNodes(i);
					// insert model at i
					this.model.splice(i, 0, newModel[i]);
					// bind model and template nodes
					this.bindModel(i);
				}
			}
		}
		
		if(this.model.length > newModel.length) {
			// remove redundant template nodes
			for(var i = this.templateNodes.length-1; newModel.length <= i; i--) {
				this.unbindModel(i);
				this.removeTemplateNodes(i);
			}
			
			// and models
			this.model.splice(newModel.length, this.model.length-newModel.length);
		}
	},
	
	bindModel: function(n) {
		for(var i = 0; i < this.templateNodes[n].length; i++) applyModelOnDOMElement(this.templateNodes[n][i], this.model[n], this.parentModel);
	},
	
	unbindModel: function(n) {
		for(var i = 0; i < this.templateNodes[n].length; i++) removeModelFromDOMElement(this.templateNodes[n][i]);
	},
	
	unbindAll: function() {
		for(var i = 0; i < this.templateNodes.length; i++) {
			this.unbindModel(i);
		}
	},
	
	/**
	 * Clone template nodes at the specified position. If ommited, template is cloned at the end.
	 */
	 
	cloneTemplateNodes: function(position) {
		if(!this.templateNodes[0]) {
			// fill element.innerHTML with the template
			//this.domElement.innerHTML = this.template;
			htmlToElem(this.domElement, this.template);
			
			// save template nodes
			this.templateNodes.push(Array.prototype.slice.call(this.domElement.childNodes));
			
			return;
		}
		
		/*var clonedNode, clonedNodes = [];
		var templateNodes = this.templateNodes[0]; // need to be changed, because this.templateNodes[0] doesn't have to exist.
		
		if(position == null || position == this.templateNodes.length) {
			// insert at the end
			for(var i = 0; i < templateNodes.length; i++) {
				clonedNode = templateNodes[i].cloneNode(true);
				this.domElement.appendChild(clonedNode);
				clonedNodes.push(clonedNode);
			}
			
			this.templateNodes.push(clonedNodes);
		}
		else {
			// insert at the position (before nodes of this.templateNodes[position])
			for(var i = 0; i < templateNodes.length; i++) {
				clonedNode = templateNodes[i].cloneNode(true);
				this.domElement.insertBefore(clonedNode, this.templateNodes[position][0]);
				clonedNodes.push(clonedNode);
			}
			
			this.templateNodes.splice(position, 0, clonedNodes);
		}*/
		
		var dummyWrapper = document.createElement("div");
		//dummyWrapper.innerHTML = this.template;
		htmlToElem(dummyWrapper, this.template);
		
		var templateNodes = Array.prototype.slice.call(dummyWrapper.childNodes);
		
		if(position == null || position == this.templateNodes.length) {
			// insert at the end
			for(var i = 0; i < templateNodes.length; i++) {
				this.domElement.appendChild(templateNodes[i]);
			}
			
			this.templateNodes.push(templateNodes);
		}
		else {
			// insert at the position (before nodes of this.templateNodes[position])
			for(var i = 0; i < templateNodes.length; i++) {
				this.domElement.insertBefore(templateNodes[i], this.templateNodes[position][0]);
			}
			
			this.templateNodes.splice(position, 0, templateNodes);
		}
	},
	
	removeTemplateNodes: function(position) {
		var templateNodes;
		if(position == null) {
			// remove last template nodes
			templateNodes = this.templateNodes.pop();
		}
		else {
			//	remove template nodes on given position
			templateNodes = this.templateNodes.splice(position, 1)[0];
		}
		
		for(var i = 0; i < templateNodes.length; i++) {
			this.domElement.removeChild(templateNodes[i]);
		}
	},
	
	// currently only works if from > to
	moveTemplateNodes: function(from, to) {
		var templateNodes = this.templateNodes[from];
		
		// insert at the position (before nodes of this.templateNodes[position])
		for(var i = 0; i < templateNodes.length; i++) {
			this.domElement.insertBefore(templateNodes[i], this.templateNodes[to][0]);
		}
		
		this.templateNodes.splice(from, 1);
		this.templateNodes.splice(to, 0, templateNodes);
	},

}

/**
 * Binds component with DOM element (names should be renamed).
 */

Component.bind = function(domElement, model, parentModel, template) {
	if(domElement.tesujiComponent) {
		// already binded element
		
		if(!domElement.tesujiComponent.containsTemplate(template)) {
			// template is different, update it
			domElement.tesujiComponent.setTemplate(template);
		}
		
		// set model
		domElement.tesujiComponent.applyModel(model, parentModel);
	}
	else {
		// create HTMLElement binding
		domElement.tesujiComponent = new Component(domElement);
		
		// set a template
		domElement.tesujiComponent.setTemplate(template);
		
		// and the model
		domElement.tesujiComponent.applyModel(model, parentModel);
	}
}
 
module.exports = Component;

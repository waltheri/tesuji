/** Tesuji.js's developer tools */

var tesuji = require("../tesuji");
var Component = require("../Component");

var dump = require("./debug").dump;

window._tesuji_dump_popup = function(model_id) {
	if(window._tesuji_elem_cache && window._tesuji_elem_cache[model_id]) {
		if(window._tesuji_popup) document.body.removeChild(window._tesuji_popup);
		
		var popup = document.createElement("div");
		popup.className = "tesuji-dev-popup";
		popup.style.position = "fixed";
		popup.style.top = "10%";
		popup.style.maxHeight = "80%";
		popup.style.left = "20%";
		popup.style.right = "20%";
		popup.style.padding = "20px";
		popup.style.overflow = "auto";
		popup.style.border = "1px solid rgba(32,32,32,0.9)";
		popup.style.color = "#eee";
		popup.style.fontFamily = "Tahoma, Arial";
		popup.style.backgroundColor = "rgba(24,24,24,0.9)";
		popup.style.boxShadow = "0 0 20px rgba(0,0,0,0.8)";
		popup.style.zIndex = "10999";
		popup.innerHTML = '<a href="javascript: void(0)" style="float: right; font-size: 30px; color: white; text-decoration: none" onclick="document.body.removeChild(_tesuji_popup); _tesuji_popup = null">&times</a>';
		popup.innerHTML += dump(window._tesuji_elem_cache[model_id]);
		
		window._tesuji_popup = popup;
		document.body.appendChild(popup);
	}
}

var htmlElement = function(elem) {
	var elem_id = Math.floor(Math.random()*1000000000);
	window._tesuji_elem_cache = window._tesuji_elem_cache || {};
	window._tesuji_elem_cache[elem_id] = elem;

	return '<a href="javascript: void(0)" onmouseover="_tesuji_elem_cache[\''+elem_id+'\'].style.outline = \'2px solid red\'" onmouseout="_tesuji_elem_cache[\''+elem_id+'\'].style.outline = \'none\'" style="color: #9999ff;">&lt;'+elem.nodeName.toLowerCase()+'&gt;</a>';
}

var modelLink = function(model) {
	if(model == null) {
		return "<em>null</em>";
	}
	else {
		var elem_id = Math.floor(Math.random()*1000000000);
		window._tesuji_elem_cache = window._tesuji_elem_cache || [];
		window._tesuji_elem_cache[elem_id] = model;

		return '<a href="javascript: void(0)" style="color: #fff;" onclick="_tesuji_dump_popup(\''+elem_id+'\')">'+model.constructor.name+'</a>';
	}
}

tesuji.debug = function() {
	if(window._tesuji_devBlock) {
		document.body.removeChild(window._tesuji_devBlock);
		window._tesuji_devBlock = null;
		return;
	}
	
	var devBlock = document.createElement("div");
	devBlock.className = "tesuji-dev";
	devBlock.style.position = "fixed";
	devBlock.style.bottom = "0";
	devBlock.style.left = "0";
	devBlock.style.right = "0";
	devBlock.style.padding = "0 20px";
	devBlock.style.maxHeight = "50%";
	devBlock.style.overflow = "auto";
	devBlock.style.borderTop = "1px solid rgba(32,32,32,0.9)";
	devBlock.style.color = "#eee";
	devBlock.style.fontFamily = "Tahoma, Arial";
	devBlock.style.backgroundColor = "rgba(24,24,24,0.9)";
	devBlock.style.boxShadow = "0 0 20px rgba(0,0,0,0.8)";
	devBlock.style.zIndex = "9999";
	
	var parts;
	var html = '<a href="javascript: void(0)" style="float: right; font-size: 30px; margin: 10px 0; color: white; text-decoration: none" onclick="this.parentElement.parentElement.removeChild(this.parentElement)">&times</a>' 
	html += '<h4 style="margin: 16px 0">tesuji.js - dev tools</h4><!--button style="float: left;margin: 12px;border: 1px solid #555;background-color: transparent;color: white;padding: 10px 15px;border-radius: 10px;cursor: pointer;">Models</button-->Binded elements:<ul>';
	for(var i = 0; i < components.length; i++) {
		html += "<li>";
		html += htmlElement(components[i].domElement)+": ";
		if(components[i].model instanceof Array) {
			parts = [];
			for(var j = 0; j < components[i].model.length; j++) {
				parts.push(modelLink(components[i].model[j]));
			}			
			html += "["+parts.join(", ")+"]";
		}
		else {
			html += modelLink(components[i].model);
		}
		html += "</li>";
	}
	html += "</ul>";
	
	devBlock.innerHTML += html;
	window._tesuji_devBlock = devBlock;
	document.body.appendChild(devBlock);
}

var oldComponentBind = Component.bind;
var models = [];
var components = [];

Component.bind = function(domElement, model, parentModel, template) {
	oldComponentBind(domElement, model, parentModel, template);
	
	for(var i = 0; i < components.length; i++) {
		if(components[i].domElement == domElement) {
			components[i] = {
				domElement: domElement,
				model: model,
				parentModel: parentModel,
				template: template
			}
			return;
		}
	}
	components.push({
		domElement: domElement,
		model: model,
		parentModel: parentModel,
		template: template
	});
}

document.addEventListener("keyup", function(e){
	if(e.keyCode == 118) { // F7
		tesuji.debug();
		e.preventDefault();
		return false;
	}
});

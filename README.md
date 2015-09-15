# tesuji.js
Javascript MV* library with magical data bindings designed to be used with Webpack or Browserify.

**In development - anything is about to change.**

## Install

Currently there isn't a compiled version of the library. You need to have [node.js](https://nodejs.org/en/download/) installed.

```
npm install tesuji
```

However this version is ready to be used with Webpack and Browserify.

## Example

This example illustrates philosophy of tesuji.js, when used with Webpack. 

File *main.js*:

```javascript
var tesuji = require("tesuji");
var Model = tesuji.Model;

// create model class
var MyModel = Model.extend(function(title, text) {
	this.title = title;
	this.text = text;
});

// with some method
MyModel.prototype.changeText = function(newText) {
	this.text = newText;
}

// define main page model
var pageModel = new Model({
	content: {
		template: require("./template.html"),
		model: new myModel("Hello World", "This is tesuji.js web app.")
	}
});

// apply main model
tesuji.applyModel(pageModel);
```

File *template.html*:

```html
<div>
  <h1 data-text="m.title"></h1>
  <div data-text="m.text"></div>
  <button data-onclick="m.changeText('You clicked the button.')">Click me!</button>
</div>
```

File *index.html*:

```html
<!doctype html>
<html lang="en">
  <head>
    <title>Example</title>
	<script src="main.js"></script>
  </head>
  <body>
    <div data-component="m.content"></div>
  </body>
</html>
```

You can also check fully working [TodoMVC app](https://github.com/waltheri/tesuji-todomvc) written in tesuji.js.
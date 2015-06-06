# tesuji.js
Javascript MV* library with magical data bindings designed to be used with Webpack or Browserify.

Currently in development - anything is about to change.

## Example

This example illustrates philosophy of tesuji.js, when used with Webpack. 

File *main.js*:

```javascript
var tesuji = require("tesuji");
var Model = tesuji.Model;
var Component = tesuji.Component;

// create model class
var MyModel = Model.extend(function(title, text){
	this.title = title;
	this.text = text;
});

// with some method
MyModel.prototype.changeText = function(newText) {
	this.text = newText;
}

// create reusable component
var MyComponent = Component.fromHTML(require("./template.html"));

// define main page model
var pageModel = new Model({
	content: new MyComponent(new myModel("Hello World", "This is example of tesuji.js web app."));
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

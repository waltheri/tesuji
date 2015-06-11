/** Data handlers */

var attributeHandlers = [
	require("./TextAttribute"),
	require("./HtmlAttribute"),
	require("./StyleAttribute"),
	require("./ClassAttribute"),
	require("./WithAttribute"),
	require("./ComponentAttribute"),
	require("./TemplateAttribute"),
	require("./ValueAttribute"),
	require("./CheckedAttribute"),
	require("./EventsAttribute"),
	require("./IfAttribute"),
	require("./AttrAttribute"),
];

module.exports = attributeHandlers;

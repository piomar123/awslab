var lab1_1 = require("./lab/lab1_1").lab
var example_1 = require("./example_1").lab;
var lab02 = require("./lab/lab1_2").lab;

var PORT = 8080;

var urlMap = [
	{path: "/", action:__dirname + "/static/index.html"},
	{path: "/digest", action: lab1_1},
	{path: "/example_1", action: example_1},
	{path: "/lab02/info", action: lab02.info},
	{path: "/static/custom.css", action: __dirname + "/static/custom.css"}, // TODO any file wildcard
	];

var service = require("./lib/service").http(urlMap);

service(PORT);


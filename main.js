var fs = require("fs"), 
    express = require("express"),
    server = express(),
    port = process.env.PORT || 3000,
    host = process.env.IP || "127.0.0.1",
    resourceJsonFile = "contacts.json",
    resourcePath = "/contacts",
    cors = function (request, response, next) {
        response.header("Access-Control-Allow-Origin", "*"); 
        response.header("Access-Control-Allow-Methods", "GET, PUT, OPTIONS"); 
        response.header("Access-Control-Allow-Headers", "Content-Type");
        next(); 
    };

fs.readFile(resourceJsonFile, function (error, resourceJson) {
    server.set("resource", JSON.parse(resourceJson));
});

server.use(express.bodyParser()); 
server.use(cors);

server.options(resourcePath, function (request, response) {
    response.send(200); 
});

server.get(resourcePath, function (request, response) { 
    response.json(server.get("resource"));
});

server.put(resourcePath, function (request, response) { 
    var resource = request.body;
    server.set("resource", resource);
    fs.writeFile(resourceJsonFile, JSON.stringify(resource));
    response.send(204); 
});

server.listen(port);

console.log("Server listening on port " + port);

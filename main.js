var fs = require("fs"), //file system
    express = require("express"),
    server = express(),
    port = process.env.PORT || 3000,
    host = process.env.IP || "127.0.0.1",
    resourceJsonFile = "contacts.json",
    resourcePath = "/contacts",
    cors = function (request, response, next) { //cross origin resource sharing
        //Response : the thing to send back to the client/ browser
        //Request: http request
        response.header("Access-Control-Allow-Origin", "*"); // *: can accept data from anywhere
        response.header("Access-Control-Allow-Methods", "GET, PUT, OPTIONS"); //get = read access, put = write access
        response.header("Access-Control-Allow-Headers", "Content-Type");
        next(); //give back control to function that called us (kind of like return statement but multiple threads - listeners)
    };

//Loadng resource asynchronously. We are just assuming it has loaded by the time we need it, but are not checking/ error handling
fs.readFile(resourceJsonFile, function (error, resourceJson) {
    server.set("resource", JSON.parse(resourceJson));
});

server.use(express.bodyParser()); //Allows us to access other domains, allows them to communicate with us
server.use(cors);

server.options(resourcePath, function (request, response) {
    response.send(200); //http status code 200 = ok
});

server.get(resourcePath, function (request, response) { //(if someone gives a get request from the resource path) Implicitly returns response object
    response.json(server.get("resource"));
});

server.put(resourcePath, function (request, response) { //If someone gives a put request at the resource path
    var resource = request.body;
    server.set("resource", resource);
    fs.writeFile(resourceJsonFile, JSON.stringify(resource));
    response.send(204); //204 – written correctly
});

server.listen(port);

console.log("Server listening on port " + port);

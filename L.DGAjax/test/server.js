var http = require('http'),
    url = require('url');

http.createServer(function(request, response) {
    var requestParam = url.parse(request.url, true);
    if (requestParam.pathname === '/test') {
        var data = requestParam.query.callback + '({"test":"ok"})';
        response.writeHead(200, {"Content-Type": "application/javascript"});
        response.end(data);
        console.log('Test server send response: ' + data);
    }
}).listen(3000);

console.log('Test server running on port 3000');
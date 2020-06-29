
const http = require('http');

http.createServer(function (req, resp) {
    if(req.url.indexOf('/api/get-cart') === 0) {
        resp.writeHead(200, {
            'Content-Type': 'application/json'
        });
        resp.end(JSON.stringify({
            success: true
        }));
    }
}).listen(5002, function() {
    console.log("Server started at 5002");
});
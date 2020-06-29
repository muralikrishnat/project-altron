var WebSocketServer = require('websocket').server;
var fs = require('fs');
var path = require('path')
var { getComponentsFromCurrentBranch } = require('./lib/git');
var connections = [];
var allowedTokens = [];
var guid = function() {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }
    return s4() + s4() + s4() + s4() + s4() + s4();
};

function broadCastToConnections() {

}

function runCommand(opts) {
    var { cwd, command } = opts;
    return new Promise((res, rej) => {
        var npmLogin = require('npm-cli-login'),
            username = opts.username,
            password = opts.password,
            email = opts.email,
            registry = opts.registry;

        try {
            npmLogin(username, password, email, registry);
            const { exec } = require('child_process');
            exec(command, {
                cwd: cwd
            }, (err, stdOut, stdErr) => {
                if (err) {
                    res({ error: stdErr });
                } else {
                    res(stdOut);
                }
            });
        } catch (err) {
            console.log("Error", err);
            res({ error: err });
        }
    });
}

function publishComponent(compFolderName) {
    return runCommand({
        command: 'npm publish',
        cwd: path.join(__dirname, 'comps', compFolderName),
        username: 'admin',
        password: 'admin123',
        email: 'muralikrishna.t@tadigital.com',
        registry: 'http://192.168.2.159:8081/repository/npm-private'
    });
}

function parseCookies(request) {
    var list = {},
        rc = request.headers.cookie;

    rc && rc.split(';').forEach(function(cookie) {
        var parts = cookie.split('=');
        list[parts.shift().trim()] = decodeURI(parts.join('='));
    });

    return list;
}

function getUrlData(opts) {
    return new Promise((res, rej) => {
        var request = require('request');
        request(opts.url, function(error, response, body) {
            if (error) {
                res({ error });
            } else {
                var jsonData = {};
                try {
                    jsonData = JSON.parse(body);
                } catch(e) {
                    //swallow
                }
                res(jsonData);
            }
        });
    });
}

function onRequest(request, response) {
    if (request.method === 'OPTIONS') {
        response.setHeader('Access-Control-Allow-Origin', request.headers.origin);
        response.setHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type, x-api-key');
        response.setHeader('Access-Control-Allow-Methods', 'GET,POST,DELETE,PATCH, OPTIONS');
        response.setHeader('Access-Control-Allow-Credentials', true);
        response.writeHead(200, {
            'Content-Type': 'application/json'
        });
        response.end();
    } else {
        response.setHeader('Access-Control-Allow-Origin', request.headers.origin);
        response.setHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type, x-api-key');
        response.setHeader('Access-Control-Allow-Methods', 'GET,POST,DELETE,PATCH, OPTIONS');
        response.setHeader('Access-Control-Allow-Credentials', true);
        var cookies = parseCookies(request);
        if (request.url.indexOf('/api/token') >= 0) {
            if (cookies && cookies.token && allowedTokens.indexOf(cookies.token) >= 0) {
                response.writeHead(200, {
                    'Set-Cookie': 'token=' + cookies.token
                });
                response.end(JSON.stringify({
                    token: cookies.token
                }));
                return;
            } else {
                if (request.method === 'POST') {
                    let body = '';
                    request.on('data', chunk => {
                        body += chunk.toString();
                    });
                    request.on('end', () => {
                        try {
                            var jsonBody = JSON.parse(body);
                            var token = guid();
                            allowedTokens.push(token);
                            response.writeHead(200, {
                                'Set-Cookie': 'token=' + token
                            });
                            response.end(JSON.stringify({
                                token: token
                            }));
                            return;
                        } catch (e) {
                            response.end(JSON.stringify({
                                error: {
                                    code: 'INVALID_FORMAT'
                                }
                            }));
                        }
                    });
                } else {
                    response.end(JSON.stringify({
                        error: {
                            code: 'REQUEST_METHOD_NOT_ALLOWED'
                        }
                    }));
                }
            }
        } else {
            if (cookies && cookies.token && allowedTokens.indexOf(token) >= 0) {
                if (request.method === 'GET') {
                    // if (request.url.indexOf('/api/token') >= 0) {

                    //     var token = guid();
                    //     allowedTokens.push(token);
                    //     response.writeHead(200, {
                    //         'Set-Cookie': 'token=' + token
                    //     });
                    //     response.end(JSON.stringify({
                    //         token: token
                    //     }));
                    //     return;
                    // }
                    response.end("");
                }
                if (request.method === 'POST') {
                    response.end('');
                    return;
                }
            } else {
                response.writeHead(200, {
                    'Content-Type': 'application/json'
                });
                response.end(JSON.stringify({
                    error: {
                        code: 'TOKEN_INVALID'
                    }
                }));
            }
        }
    }
}
module.exports = function({ server, port, rootPath, ssl, httpsServer }) {
    var httpServer = server;
    var secureServer = httpsServer;
    if (!httpServer && !ssl) {
        httpServer = require('http').createServer(onRequest).listen(port, () => {});
    }
    if (ssl) {
        if (!httpsServer) {
            secureServer = require('https').createServer({
                key: fs.readFileSync(path.join(__dirname, 'ssl', 'server.key')),
                cert: fs.readFileSync(path.join(__dirname, 'ssl', 'server.crt'))
            }, onRequest).listen(port, () => {});
        }
    }
    var wsServer = new WebSocketServer({
        httpServer: ssl ? secureServer : httpServer,
        autoAcceptConnections: false
    });

    wsServer.on('request', function(request) {
        var connection = request.accept(null, request.origin);
        console.log((new Date()) + ' Connection accepted.');
        connection.on('message', function(message) {
            if (message.type === 'utf8') {
                try {
                    var dataToCheck = JSON.parse(message.utf8Data);
                    var { actionName, actionData, token } = dataToCheck;
                    if (token && allowedTokens.indexOf(token) >= 0) {
                        switch (actionName) {
                            case 'GET_COMPS':
                                getComponentsFromCurrentBranch({
                                    rootPath: __dirname
                                }).then((resp) => {
                                    connection.sendUTF(JSON.stringify({
                                        actionName: 'GET_COMPS',
                                        actionData: {
                                            comps: resp.comps
                                        }
                                    }));
                                });
                                break;
                            case 'PUBLISH_COMP':
                                publishComponent(actionData.compFolderName).then(resp => {
                                    connection.sendUTF(JSON.stringify({
                                        actionName: 'PUBLISH_COMP'
                                    }));
                                });
                                break;
                            case 'NEXUS_COMPS':
                                getUrlData({
                                    url: 'http://192.168.2.159:8081/service/rest/v1/components?repository=npm-group'
                                }).then(resp => {
                                    connection.sendUTF(JSON.stringify({
                                        actionName: 'NEXUS_COMPS',
                                        actionData: {
                                            comps: resp
                                        }
                                    }));
                                });
                                break;
                            default:
                                break;
                        }
                    }
                } catch (e) {
                    //swallow
                }
            } else if (message.type === 'binary') {
                console.log('Received Binary Message of ' + message.binaryData.length + ' bytes');
                //connection.sendBytes(message.binaryData);
            }
        });
        connection.on('close', function(reasonCode, description) {

        });

        if (connection.connected) {
            var connectionId = 'C' + new Date().getTime();
            connection.connectionId = connectionId;
        }
    });
};
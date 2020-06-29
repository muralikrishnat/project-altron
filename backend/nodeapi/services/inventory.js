const http = require('http');

const MongoClient = require('mongodb').MongoClient;
const {sendResponse} = require('./utils');
const CONSTANTS = require('./configs');
const MONGO_URL = CONSTANTS.DB.MONGO_URL || 'mongodb://mongodb-app:27017';
const DB_NAME = CONSTANTS.DB.DB_NAME || 'project-altron';
let db;
var jwt = require('jsonwebtoken');
const jwtKey = '1234567890';
const jwtExpirySeconds = 1000 * 60;
MongoClient.connect(MONGO_URL, (_err, client) => {
    if (_err) throw console.log(_err);
    db = client.db(DB_NAME);
});



http.createServer(async (request, response) => {
    let checkAuthentication = true;
    let allowRequest = true;
    let payload = null;
    let authorizationMessage = 'Authorization token is required to access this end point';

    if (checkAuthentication) {
        if (request.headers && request.headers.authorization) {
            let token = request.headers.authorization.replace('Bearer ', '');
            if (request.headers.authtype && request.headers.authtype === 'AZURE') {
                let decodedInfo = await new Promise((res, rej) => {
                    try {
                        nJwt.verify(token, 'secret', 'HS512', function(tokenInfo){
                            res(tokenInfo)
                        });
                    } catch(e) {
                        //swallow
                        res(null);
                    }
                });
                if (decodedInfo && decodedInfo.parsedBody) {
                    let parsedBody = decodedInfo.parsedBody;
                    if (parsedBody.unique_name || parsedBody.upn) {
                        let username = parsedBody.unique_name || parsedBody.upn;
                        let useRecord = await new Promise((res, rej) => {
                            db.collection('users').find({
                                username
                            }).toArray((err, docs) => {
                                if (docs.length > 0) {

                                } else {
                                    db.collection('users').insertOne({
                                        username,
                                        name: request.headers.name
                                    });
                                }
                                res({
                                    name: request.headers.name
                                });
                            });
                            
                        });
                        payload = {
                            username,
                            name: useRecord.name
                        };
                        allowRequest = true;
                    }
                } else {
                    allowRequest = false;
                }
            } else {
                try {
                    payload = jwt.verify(token, jwtKey);
                    allowRequest = true;
                } catch (e) {
                    allowRequest = false;
                    authorizationMessage = 'Authorization is not valid';
                }
            }
        } else {
            allowRequest = false;
        }
    }

    if (allowRequest) {
        if (request.method === 'OPTIONS') {
            sendResponse({
                request,
                response
            });
        } else {
            if(request.url.indexOf('/api/get-inventory') === 0) {
                db.collection('products').find({}).toArray((findErr, result) => {
                    sendResponse({
                        request,
                        response,
                        body: {
                            data: result,
                            username: payload.username
                        }
                    });
                });
            } else {
                sendResponse({
                    request,
                    response,
                    body: {
                        error: {
                            
                        }
                    }
                });
            }
        }
    } else {
        sendResponse({
            request,
            response,
            body: JSON.stringify({
                error: {
                    code: 'NOT_AUTHORIZED',
                    message: authorizationMessage
                }
            })
        });
    }
    
}).listen(5001, () => {
    console.log("Server started at 5001");
});
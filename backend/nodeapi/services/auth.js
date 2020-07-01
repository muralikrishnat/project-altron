const http = require('http');
const path  = require('path');

const MongoClient = require('mongodb').MongoClient;
const formidable = require('formidable');
var jwt = require('jsonwebtoken');
const jwtKey = '1234567890';
const jwtExpirySeconds = 1000 * 60;


const {sendResponse} = require('./utils');
const CONSTANTS = require('./configs');
const MONGO_URL = 'mongodb://localhost:27017';
const DB_NAME = CONSTANTS.DB.DB_NAME || 'project-altron';

let db;
MongoClient.connect(MONGO_URL, (_err, client) => {
    if (_err) throw console.log(_err);
    db = client.db(DB_NAME);
});

http.createServer(function (request, response) {
    if(request.url.indexOf('/api/authenticate') === 0) {
        const form = formidable({
            multiples: true,
            uploadDir: path.join(__dirname, 'upload-files')
        });
        form.parse(request, (err, fields, files) => {
            db.collection('users').find({
                username: fields.username,
                password: fields.password
            }).toArray((err, docs) => {
                let respBody = {};
                if (!err && docs.length > 0) {
                    respBody['token'] = jwt.sign({ 
                        username: fields.username,
                        name: docs[0].name
                    }, jwtKey, {
                        algorithm: 'HS256',
                        expiresIn: jwtExpirySeconds
                    });
                    respBody['username'] = fields.username;
                    respBody['name'] = docs[0].name;
                } else {
                    respBody['error'] = {
                        code: "INAVLID_DATA",
                        message: 'Username and Password not valid'
                    };
                }
                sendResponse({
                    request,
                    response,
                    body: respBody
                });
            });
        });
    } else {
        sendResponse({
            request,
            response,
            body: {}
        });
    }
}).listen(5003, () => {
    console.log("Server started at 5003");
});


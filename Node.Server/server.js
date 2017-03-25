'use strict';

const fs = require('fs');
const grpc = require('grpc');
const implementation = require('./serverImplementation');

const PROTO_PATH = 'pb/messages.proto';
const serviceDef = grpc.load(PROTO_PATH);
const PORT = 9000;

const cacert = fs.readFileSync('Keys/ca.crt');
const cert = fs.readFileSync('Keys/server.crt');
const key = fs.readFileSync('Keys/server.key');
const kvpair = {
    'private_key': key,
    'cert_chain': cert
};

const credentials = grpc.ServerCredentials.createSsl(cacert, [kvpair]);
const server = new grpc.Server();

server.addProtoService(serviceDef.UserService.service, {
    getByUserId: implementation.getByUserId,
    getAll: implementation.getAll,
    save: implementation.save,
    saveAll: implementation.saveAll,
    addImage: implementation.addImage
});
server.bind(`0.0.0.0:${PORT}`, credentials);
console.log(`Starting server on port ${PORT}`);
server.start();

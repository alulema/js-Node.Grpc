'use strict';

const fs = require('fs');
const grpc = require('grpc');
const implementation = require('./clientImplementation');

const PROTO_PATH = 'pb/messages.proto';
const serviceDef = grpc.load(PROTO_PATH);
const PORT = 9000;

const cacert = fs.readFileSync('Keys/ca.crt');
const cert = fs.readFileSync('Keys/client.crt');
const key = fs.readFileSync('Keys/client.key');
const kvpair = {
    'private_key': key,
    'cert_chain': cert
};

const credentials = grpc.credentials.createSsl(cacert, key, cert);
const client = new serviceDef.UserService(`Alexiss-MacBook-Pro.local:${PORT}`, credentials);

implementation.getByUserId(client);
implementation.getAll(client);
implementation.addImage(client);
implementation.saveAll(client);
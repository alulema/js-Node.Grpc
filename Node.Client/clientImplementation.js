const fs = require('fs');
const grpc = require('grpc');

module.exports = {
    getByUserId: function (client) {
        const md = new grpc.Metadata();
        md.add("username", 'Alexis');
        md.add("password", "12345");

        client.getByUserId({ userId: 1 }, md, function (err, response) {
            if (err)
                console.log(err);
            else
                console.log(response.user);
        });
    },
    getAll: function (client) {
        const call = client.getAll({});

        call.on('data', function (data) {
            console.log(data.user);
        });
    },
    addImage: function (client) {
        const md = new grpc.Metadata();
        md.add("userId", "1");

        const call = client.addImage(md, function (err, result) {
            console.log(result);
        });

        const stream = fs.createReadStream("Images/NodeMcu.jpg");
        stream.on("data", function (chunk) {
            call.write({data: chunk});
        });
        stream.on("end", function () {
            call.end();
        });
    },
    saveAll: function (client) {
        const users = [
            {
                id: 4,
                firstName: 'Luke',
                lastName: 'Skywalker',
                birthday: new Date(1977, 11, 22).getTime(),
                vehicles: [
                    { id: 7, regNumber: 'SJDKJSDKJI200' },
                    { id: 8, regNumber: 'WIUDSBDJK9328' }
                ]
            }
        ];

        const call = client.saveAll();
        call.on("data", function (usr) {
            console.log(usr.user)
        });

        users.forEach(function (usr) {
            call.write({user: usr});
        });
        call.end();
    }
};

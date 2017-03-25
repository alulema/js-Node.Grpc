const data = require('./users');

module.exports = {
    getByUserId: function (call, callback) {
        const md = call.metadata.getMap();

        for (let key in md) {
            console.log(key, md[key]);
        }

        const userId = call.request.userId;
        const uLength = data.users.length;

        for (let i = 0; i < uLength; i++) {
            if (data.users[i].id === userId) {
                callback(null, { user: data.users[i] });
                return;
            }
        }

        callback('error');
    },
    getAll: function (call) {
        data.users.forEach(function (usr) {
            call.write({ user: usr });
        });

        call.end();
    },
    addImage: function (call, callback) {
        const md = call.metadata.getMap();
        let result = new Buffer(0);

        for (let key in md) {
            console.log(key, md[key]);
        }

        call.on('data', function (data) {
            result = Buffer.concat([result, data.data]);
            console.log(`Message received with size ${data.data.length}`);
        });
        call.on('end', function () {
            callback(null, { isOk: true });
            console.log(`Total file size: ${result.length} bytes`);
        });
    },
    saveAll: function (call) {
        call.on('data', function (req) {
            data.users.push(req.user);
            call.write({ user: req.user })
        });
        call.on('end', function () {
            data.users.forEach(function (usr) {
                console.log(usr);
            });
            call.end();
        });
    }
}
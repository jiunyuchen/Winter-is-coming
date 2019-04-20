let model = require('../../static/models/User.js');
let dao = require('./dao.js');


module.exports = {
    getUsers,
    getUserByUsername,
    addUser,
    getUserByToken
};

function getUsers(callback) {
    dao.data.db.view('users/all', function (err, docs) {
        let users = [];
        if (err) console.log("Error getting all users", err);
        else if (docs) {
            for (let doc in docs) {
                users.push(doc);
            }
        }
        callback(users);
    });
}

function getUserByUsername(username, callback) {
    dao.data.db.view('users/byUsername', {key: username}, function (err, doc) {
        if (err) console.log("Error fetching user by username", err);
        else {
            if (doc.length !== undefined) {
                doc = doc[0];
            }

            if (!doc || !doc.value) callback(null);
            else callback(doc.value);
        }
    });
}

function getUserByToken(token, callback) {
    dao.data.db.view('users/byToken', {key: token}, function (err, doc) {
        if (err) console.log("Error fetching user by token", err);
        else {
            if (doc.length !== undefined) {
                doc = doc[0];
            }

            if (!doc || !doc.value) callback(null);
            else callback(doc.value);
        }
    });
}

function addUser(user, callback) {
    let userData = Object.assign(JSON.parse(user.toJSON()), {resource: 'user'});

    dao.data.db.save(userData, (err, res) => {
        if (err) console.log("Error saving user", err);
        else {
            callback(user.toJSON());
        }
    });
}

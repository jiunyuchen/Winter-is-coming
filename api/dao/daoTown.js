/**
 * This is the Data Access Object for storing and accesing only town-related
 * information from the database. It is separated from the other DAO applications
 * and so does not affect calls to the database for other resources/documents.
 * 
 */

let dao = require('./dao.js');
const Town = require('../../static/js/models/Town.js');

// export modules
module.exports = {
    getTowns,
    getTownById,
    addTown
};

// retrieve town by ID
function getTownById(id, callback) {
    dao.data.db.view('towns/all', {key: id}, function (err, doc) {
        if (err) console.log("Error fetching town by id", err);
        else {
            if (doc.length !== undefined) {
                doc = doc[0];
            }

            if (!doc || !doc.value) callback(null);
            else callback(Town.fromJSON(doc.value));
        }
    });
}

// get all towns
function getTowns(callback) {
    dao.data.db.view('towns/all', function (err, doc) {
        let towns = [];
        if (err) console.log('Error getting towns');
        else if (doc) {
            for (let d of doc) {
                let town = Town.fromJSON(d.value);
                towns.push(town);
            }
        }
        callback(towns);
    });
}

// add a new town; currently used when new database is initialised
// could be expanded in the future to allow users to add new towns
function addTown(town, callback) {
    dao.data.db.save(town.id + "", JSON.parse(town.toJSON()), function (err, res) {
        callback(town.toJSON());
    });
}

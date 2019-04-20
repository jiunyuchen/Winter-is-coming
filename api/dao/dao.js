/**
 * This is our Data Access Object. It defines functionality for storing information
 * about Posts. The rest of our application only needs to ask the DAO to store
 * something, without caring how it is done.
 *
 * All the database stuff goes in here. This means that only this file needs to contain
 * knowledge about the DB implementation, and it can be easily swapped for another file,
 * using a different database.
 *
 * @date Apr 2018
 * @module api/dao
 */

(function () { // wrap into a function to scope content

    let fs = require('fs');
    let cradle = require('cradle');
    let maxID = [0];
    let maxIDImage = [0];
    //let townID = [0];

    // Load the DB configuration from a file. This way it's easy to change it around
    let dbinfo = JSON.parse(fs.readFileSync('db.json', 'utf8'));

    let db = new (cradle.Connection)(dbinfo.url, { auth: dbinfo.auth }).database(dbinfo.dbname);

    function init() {
        db.exists(function (err, exists) {
            if (err) {
                console.log('Error checking database existence', err);
            } else {
                if (exists) {
                    console.log('Database found');
                    db.view('allposts/max', function (err, doc) {
                        if (!doc || !doc[0]) {
                            maxID[0] = 0;
                        } else {
                            maxID[0] = doc[0].value;
                        }
                    }
                    );

                    db.view('images/max', function (err, doc) {
                        if (!doc || !doc[0]) {
                            maxIDImage[0] = 0;
                        } else {
                            maxIDImage[0] = doc[0].value;
                        }
                    }
                    );

                    createDbDesigns(db);

                } else {
                    console.log('Database not found - Creating new database');
                    db.create(err => {
                        if (err) {
                            console.log('Error creating database', err);
                        } else {
                            console.log('Creating initial towns');
                            const Town = require('../../static/js/models/Town.js');
                            let towns = [
                                new Town("st-andrews", "St Andrews", 2638864),
                                new Town("dundee", "Dundee", 3333225),
                                new Town("cupar", "Cupar", 2651698)
                            ];

                            for (let k in towns) {
                                let town = towns[k];

                                db.save(town.id, town.toJSON(), (err, res) => {
                                    if (err) {
                                        console.log(err);
                                    } else {
                                        console.log('- ' + town.name + ' added');
                                    }
                                });
                            }

                            createDbDesigns(db);

                        }
                    });

                }
            }
        });
    }

    function createDbDesigns(db) {
        // Now store the view we wish to use. The most important thing here is the
        // "all" view, which simply gets all elements from the database.
        //
        // Another thing that is important is getting the highest ID in the database.
        // If we restart our server, it should not start counting IDs from zero, but start
        // with the largest ID in the database.
        //
        // We could manually type this into the CouchDB's HTML interface in a browser,
        // but our application should really be able to initialise all its views properly.
        console.log('(Re-)Saving DB Designs (views)');

        db.save('_design/allposts', {
            all: {
                map: function (doc) {
                    if (doc.id >= 0 && doc.type == "post") emit(doc.id, doc);
                }
            },
            max: {
                map: function (doc) {
                    if (doc.id && doc.type == "post") emit(1, doc.id);
                },
                reduce: function (key, values, rereduce) {
                    return Math.max.apply(Math, values);
                }
            },
            count: {
                map: function (doc) {
                    if (doc.id && doc.type == "post") emit(doc.type, 1);
                },
                reduce: function (key, values, rereduce) {
                    return sum(values);
                }
            }
        });

        db.save('_design/images', {
            all: {
                map: function (doc) {
                    if (doc._attachments) emit(doc.id, doc);
                }
            },
            max: {
                map: function (doc) {
                    if (doc._attachments) emit(1, parseInt(doc._id.replace(/image_/, "")));
                },
                reduce: function (key, values, rereduce) {
                    return Math.max.apply(Math, values);
                }
            }
        });

        db.save('_design/users', {
            all: {
                map: function (doc) {
                    if (doc.resource && doc.resource === 'user') emit(doc.id, doc);
                }
            },

            byUsername: {
                map: function (doc) {
                    if (doc.resource && doc.resource === 'user') emit(doc.username, doc);
                }
            },

            byToken: {
                map: function (doc) {
                    if (doc.token && doc.resource && doc.resource === 'user') emit(doc.token, doc);
                }
            }
        });

        db.save('_design/towns', {
            all: {
                map: function (doc) {
                    if (doc._id && doc.resource && doc.resource === 'town') emit(doc._id, doc);
                }
            }
        });
    }

    // Some of our handlers accept callbacks. It might be a good idea to document those as well
    // by telling JSDoc what they expect

    /**
     * @callback returnMaxID
     * @param {Number} MaxID - largest ID in the database
     */

    /**
     * @callback returnAllPosts
     * @param {Object} posts - an object containing an array with all posts
     */

    /**
     * @callback returnSinglePost
     * @param {Object} post - the object that was created or deleted
     */



    let exports = {
        /**
         * Initialise the DAO. This will check if the the database exists already and open it.
         * If the database does not exist, it will create it and fill it with some initial data.
         *
         * @function
         * @param {returnMaxID} callback - The function to be called when the DB fetch is finished
         */
        init: init,
        /**
         * Returns all posts from the database.
         *
         * @function
         * @param {returnAllPosts} callback - The function to be called when the DB fetch is finished
         */
    };

    //Exporting the data held by the dao to be processed by othe controlers
    exports.data = {
        maxID: maxID,
        maxIDImage: maxIDImage,
        //townID: townID,
        db: db
    };


    if (typeof __dirname == 'undefined') {
        window.exports = exports;
    } else {
        module.exports = exports;
    }

})();

/**
 * This is the internal API for controlling requests regarding town data.
 * It is isolated from the rest of the code and only handles town-related
 * HTTP requests. Information from the requests is retrieved from the database.
 *
 * It requires daoTown.js and dao.js files for the access to the database.
 *
 * @module api/controllers/town
 */

(function () {
    const dao = require('../dao/daoTown.js');
    const daoData = require('../dao/dao.js');
    const Town = require('../../static/js/models/Town');

    module.exports = {
        addTown,
        getTown,
        getTowns
    };

    /**
     * Handler for adding towns. Currently unused.
     */
    function addTown(req, res, next) {

        let townID = daoData.data.townID[0];
        let id = townID + 1;
        daoData.data.townID[0] = id;

        let jsonobj = req.body;
        jsonobj.id = id;

        let town = Town.fromJSON(jsonobj);


        dao.addTown(town, function (retpost) {
            console.log("Got: " + retpost);
            console.log(jsonobj);

            res.status(201).end(JSON.stringify(retpost));
        });
    }

    /**
     * Handler to get towns by ID. An error is returned if the
     * request town does not exist
     */
    function getTown(req, res, next) {
        let townId = req.params.id;

        dao.getTownById(townId, (town) => {
            if (!town) {
                return res.status(404).send({error: 'Town not found'});
            }

            return res.send(town.toJSON());
        });
    }

    /**
     * Handler for getting all towns currently stored in the database
     */
    function getTowns(req, res, next) {
        dao.getTowns(towns => {
            let data = [];
            for (let k in towns) {
                data.push(towns[k].toJSON());
            }

            return res.send(data);
        });
    }

})();
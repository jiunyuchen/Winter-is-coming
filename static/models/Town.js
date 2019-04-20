/**
 * This is the model for the object class Town, used to create and store
 * towns as objects in the database. The default towns are added upon
 * initialising new database; the below is currently only used for that
 * but additional feature may be added in the future to allow users to
 * create new town pages.
 *
 */

(function () {
    let modelName = 'Town';

    /**
     * Class representing town. Contains a unique town ID, name, and town's
     * weather ID as given by the openweathermap.org API which is required to
     * retrieve the town's weather data. The resource is used to define town
     * as town in the database.
     */
    class Town {
        /**
         *
         * @param {string} id - town ID. Should be lower case and use - for spaces
         * @param {string} name - town name, should be capitalised and spelled as appropriate
         * @param {*} weatherID - weather ID for the town as provided by openweathermap.org/api
         */
        constructor(id, name, weatherID) {
            this._id = id;
            this._name = name;
            this._weatherID = weatherID;
            this._resource = "town";
        }

        fromJSON(data) {
            let instance = new Town(data.id ? data.id : data._id, data.name, data.weatherID);
            return instance;
        }

        toJSON() {
            return {
                id: this._id,
                name: this._name,
                weatherID: this._weatherID,
                resource: this._resource
            };
        }

        /**
         * Name of the town
         * @type {string}
         * @readonly
         */
        get name() {
            return this._name;
        }

        /**
         * ID of the town
         * @type {string}
         * @readonly
         */
        get id() {
            return this._id;
        }

        /**
         * Weather ID of the town.
         * Possible to reset if a different weather API is used
         * @type {number}
         */
        get weatherID() {
            return this._weatherID;
        }

        set weatherID(newID) {
            this._weatherID = newID;
        }

        /**
         * Resource type to identify town document in the database
         * @type {string}
         * @readonly
         */
        get resource() {
            return this._resource;
        }

        route(routeName) {
            let route;
            if (routeName === 'landing') {
                route = '/';
            } else {
                route = '/' + routeName;
            }

            return '/town/' + this.id + route;
        }
    }


    // Export class desinitions for pieces and squares, as they should be public.
    let exports = { Town: Town }

    if (typeof __dirname == 'undefined')  { // Running in browser
        if (!window.exports) {
            window.exports = {};
        }
         for (key in exports) {
        window.exports[key] = exports[key];
    }
}
    else                                        // Running in node.js
        module.exports = exports;
    
})();

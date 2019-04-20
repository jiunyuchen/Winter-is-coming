/**
 * This is the model for the class Image used for creating image files
 * to be uploaded and stored on the database.
 *
 */

(function () {

    /**
     * Class representing a Image. This will contain the description,
     * colour, day, and an id
     */
    class Image {
        /**
          * Create a new image
          *
          * @param {number} id - The ID of the new image
          * @param {string} town - The day of the new image
          * @param {string} type - A short description of the image
          * @param {string} username - A short description of the image
          */
        constructor(id, town, type, username) {


            // Check if we got all arguments, otherwise initialise to empty/zero
            if (typeof (town) != 'undefined') {
                this._id = id;
                this._town = town;
                this._type = type;
                this._username = username;
            } else {
                this._id = -1;
                this._town = "";
                this._type = "";
                this._username = "";
            }
        }

        // Getters and setters. Do not allow setting id

        /**
         * The ID of this image
         * @type {number}
         * @readonly
         */
        get id() { return this._id; }


        /**
         * A short description of the image
         * @type {string} 
         */

        get town() { return this._town; }
        set town(d) { this._town = d; }

        /**
      * A short description of the image
      * @type {string} 
      */

        get type() { return this._type; }
        set type(d) { this._type = d; }

        /**
           * A short description of the image
           * @type {string} 
           */

        get username() { return this._username; }
        set username(d) { this._username = d; }


        /**
         * Returns the important properties as a JSON object.
         * We can then pass this over a network
         *
         * @returns {Object} The JSON representation
         */
        toJSON() {
            let result = {};
            result.id = this._id;
            result.town = this._town;
            result.type = this._type;
            result.username = this._username;

            return JSON.stringify(result);
        }

        /**
         * Takes a JSON object and reads the properties from it.
         * We might receive such an object over the network and want
         * to create an object that is easier to manipulate
         *
         * @param {Object} json - The JSON representation to initialise from
         */
        fromJSON(json) {
            if (json.hasOwnProperty('id') && typeof (json.id) === 'number' && json.id >= 0)
                this._id = json.id;

            if (json.hasOwnProperty('type') && typeof (json.type) === 'string' && json.type == "image")
                this._type = json.type;

            if (json.hasOwnProperty('town') && typeof (json.town) === 'string' && json.town != "")
                this._town = json.town;


                if (json.hasOwnProperty('username') && typeof (json.username) === 'string' && json.username != "")
                this._username = json.username;


        }
    }

    // Export the parts that should be public. In this case it is only the
    // class definition. The two names below ("image") could be different, but
    // there is not need to complicate things, so we use the same name
    let exports = {
    	/**
    	 * Images submitted by the users.
    	 */
        Image
    }

    if (typeof __dirname == 'undefined') { // Running in browser
        if (!window.exports) {
            window.exports = {};
        }
        for (key in exports) {
            window.exports[key] = exports[key];
        }
    }
    else                                        // Running in node.js
        module.exports = exports;

}())

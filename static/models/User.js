
/**
 * This is the model for the object class User, used to create and store
 * user information on the database. It is used to get usernames and the
 * associated passwords which then allows users to authenticate themselves
 * when repeatedly visiting the site.
 *
 */

(function () {

    /**
     * Class representing a User. This will contain a unique user id,
     * username and password. Email is included to potentially be added 
     * as an extended feature in the future.
     */

    class User {
        /**
         * 
         * @param {number} id - unique ID of the user
         * @param {string} username 
         * @param {string} password 
         * @param {string} email 
         * @param {string} token 
         */
        constructor(id, username, password, email, token) {

            // Check all arguments, otherwise initialise to empty/zero

            this._id = id;
            this._username = username;
            this._password = password;
            this._email = email;
            this._token = token;

        }
        // Getters and setters
        /**
         * User ID
         * @type {number}
         */
        get id() { return this._id; }
        set id(d) { this._id = d; }

        /**
         * Username
         * @type {string}
         */
        get username() { return this._username; }
        set username(d) { this._username = d; }

        /**
         * User password
         * @type {string}
         */
        get password() { return this._password; }
        set password(d) { this._password = d; }

        /**
         * User email
         * @type {string}
         */
        get email() { return this._email; }
        set email(c) { this._email = c; }

        
        get token(){ return this._token; }
        set token(t){ this._token = t; }

        /**
         * Returns the important properties as a JSON object.
         * We can then pass this over a network
         *
         * @returns {Object} The JSON representation
         */
        toJSON() {

            let result = {};
            result.id = this._id;
            result.username = this._username;
            result.password = this._password
            result.email = this._email;
            result.token = this._token;


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

            if (json.hasOwnProperty('username') && typeof (json.username) === 'string' && json.username != "")
                this._username = json.username;

            if (json.hasOwnProperty('password') && typeof (json.password) === 'string' && json.password != "")
                this._password = json.password;

            if (json.hasOwnProperty('email') && typeof (json.email) === 'string' && json.email != "")
                this._email = json.email;

            if (json.hasOwnProperty('token') && typeof (json.token) === 'string' && json.token != "")
                this._token = json.token;

            return this;
        }
    }

    // Export class desinitions for pieces and squares, as they should be public.
    let exports = { User: User }

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
}())

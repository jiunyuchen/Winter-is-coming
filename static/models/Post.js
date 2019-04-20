/**
 * This is the model for the object class Post, used to create and store
 * forum posts on the database as well as display it on the client side.
 *
 */

(function () {

    /**
     * Class representing a Post. This will contain the description,
     * colour, day, an id and a timestamp
     */
    class Post {
        /**
          * Create a new post
          *
          * @param {number} id - The ID of the new post
          * @param {string} title - The day of the new post
          * @param {string} desc - A short description of the post
          * @param {date} date - Time the post was created
          */
        constructor(id, title, desc, town, type, date, username) {


            // Check if we got all arguments, otherwise initialise to empty/zero
            if (typeof (title) != 'undefined') {
                this._id = id;
                this._title = title;
                this._desc = desc;
                this._town = town;
                this._type = type;
                this._date = date;
                this._username = username;
            } else {
                this._id = -1;
                this._title = "";
                this._desc = "";
                this._town = "";
                this._type = "";
                this._date = Date.now();
                this._username = "";
            }
        }

        // Getters and setters. Do not allow setting id

        /**
         * The ID of this post
         * @type {number}
         * @readonly
         */
        get id() { return this._id; }


        /**
         * A title of the post
         * @type {string}
         */
        get title() { return this._title; }
        set title(d) { this._title = d; }


        /**
         * A short description of the post
         * @type {string}
         */

        get description() { return this._desc; }
        set description(d) { this._desc = d; }


        /**
         * A short description of the post
         * @type {string}
         */

        get town() { return this._town; }
        set town(d) { this._town = d; }

        /**
        * A short description of the post
        * @type {string}
        */

        get type() { return this._type; }
        set type(d) { this._type = d; }

        get date() { return this._date}

        /**
         * Returns the important properties as a JSON object.
         * We can then pass this over a network
         *
         * @returns {Object} The JSON representation
         */
        toJSON() {
            let result = {};
            result.id = this._id;
            result.title = this._title;
            result.desc = this._desc;
            result.town = this._town;
            result.type = this._type;
            result.date = this._date;
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

            if (json.hasOwnProperty('title') && typeof (json.title) === 'string' && json.title != "")
                this.title = json.title;

            if (json.hasOwnProperty('desc') && typeof (json.desc) === 'string' && json.desc != "")
                this._desc = json.desc;

            if (json.hasOwnProperty('town') && typeof (json.town) === 'string' && json.town != "")
                this._town = json.town;

            if (json.hasOwnProperty('type') && typeof (json.type) === 'string' && json.type == "post")
                this._type = json.type;

            if(json.hasOwnProperty('date'))
              this._date = json.date;

            if(json.hasOwnProperty('username'))
              this._username = json.username;

            return this;
        }

    }

    // Export the parts that should be public. In this case it is only the
    // class definition. The two names below ("post") could be different, but
    // there is not need to complicate things, so we use the same name
    let exports = {
    	/**
    	 * Forum posts made by the users. Need to have title and message content.
    	 */
        Post
    }

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

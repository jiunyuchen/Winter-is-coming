/**
 * This is the internal API for controlling user registration and authentication.
 * It is isolated from the rest of the code and only handles user-related requests.
 * When new users are created, a unique token is generated and assigned to them.
 * All user information gets stored on the database.
 *
 * It requires daoUser.js and the User model.
 *
 * @module api/controllers/users
 */

(function () {

    const daoUser = require('../dao/daoUser.js');
    const User = require('../../static/models/User.js');
    const bcrypt = require('bcrypt');

    /**
     * Generates a token from the username - this is very much a simplified token generation.
     * As username is unique this token will always be unique and is always salted (salt is generated randomly).
     * It removes any non-alphanumeric characters to make sure the token is URL safe.
     *
     * @param username
     * @returns {string}
     */
    let generateRandomToken = (username) => {
        // Just re-use same bcrypt hashing algorithm and hash the username as it's guaranteed to be unique
        // Extremely simple Auth system, could benefit from more advanced techniques if need more security
        return bcrypt.hashSync(username, bcrypt.genSaltSync(8)).replace(/[^a-zA-Z0-9]/g, '');
    };

    /**
     * Login endpoint - accepts username & password in the body and validates it.
     *
     * @param req
     * @param res
     */
    let login = (req, res) => {
        let username = req.body.username,
            password = req.body.password;

        if (!username || !password) {
            return res.send({success: false, message: 'Please enter username & password'});
        }

        // Get user
        daoUser.getUserByUsername(username, (user) => {
            if (!user) {
                res.send({success: false, message: 'Invalid username or password'});
            } else {
                // Check password
                bcrypt.compare(password, user.password).then(matches => {
                    if (matches === true) {
                        // Login successful
                        return res.send({success: true, user: user});
                    } else {
                        res.send({success: false, message: 'Invalid username or password'});
                    }
                });
            }
        });
    };

    /**
     * Register endpoint. Takes in username, password and password_confirm parameters in the body, validated them and
     * creates a new User record.
     *
     * @param req username, password, password_confirm
     * @param res
     */
    let register = (req, res) => {
        let username = req.body.username,
            password = req.body.password,
            passwordConfirm = req.body.password_confirm;

        if (!username || !password) {
            return res.send({success: false, message: 'Please enter username & password'});
        }

        if (password !== passwordConfirm) {
            return res.send({success: false, message: 'Please make sure password confirmation matches the password'});
        }

        // Check that username doesn't exist
        daoUser.getUserByUsername(username, user => {
            if (user) {
                res.send({success: false, message: 'Username already taken'});
            } else {

                // Username doesn't exist, all seems good - proceed
                // Encrypt the password
                bcrypt.hash(password, 8).then(passHash => {

                    // Create user object to save
                    let user = new User.User().fromJSON({
                        username,
                        password: passHash,
                        token: generateRandomToken(username)
                    });

                    // Persist the user object
                    daoUser.addUser(user, (u) => {
                        // Success
                        res.send({success: true, user: u});
                    });

                });

            }
        });
    };

    module.exports = {
        login,
        register
    };

})();
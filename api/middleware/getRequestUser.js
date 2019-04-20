(function () {

    const UserRepository = require('../dao/daoUser');
    const User = require('../../static/models/User');

    module.exports = (req, res, next) => {

        // Get token from the header
        let userToken = req.get('Authorisation');


        if (userToken === undefined || userToken === null) {
            // If no token provided set user to null
            req.user = null;
            return res.status(403).json({error: 'You have to be logged in to proceed'});
        } else {
            // Check the token is valid
            UserRepository.getUserByToken(userToken, userData => {
                if (!userData) {
                    req.user = null;
                    return res.status(403).json({error: 'You have to be logged in to proceed'});
                } else {
                    req.user = (new User.User()).fromJSON(userData);
                    next();
                }
            })
        }

    };

})();